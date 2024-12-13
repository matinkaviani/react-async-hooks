import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "../src/hooks/useFetch";

describe("useFetch", () => {
  beforeEach(() => {
    global.fetch = jest.fn(); // Mock the fetch function
  });

  afterEach(() => {
    jest.clearAllMocks(); // Ensure fetch is reset between tests
  });

  it("fetches data successfully", async () => {
    const realFetch = fetch as jest.Mock;
    realFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Hello World" }),
    });

    const { result } = renderHook(() =>
      useFetch<{ message: string }>("/api/test")
    );
    await waitFor(() =>
      expect(result.current.data).toEqual({ message: "Hello World" })
    );

    expect(result.current.data).toEqual({ message: "Hello World" });
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  //   it("uses cached data when available", async () => {
  //     const realFetch = fetch as jest.Mock;
  //     const testData = { message: "Hello World" };

  //     const { result } = renderHook(() =>
  //       useFetch<{ message: string }>(
  //         "/api/test",
  //         { method: "GET" },
  //         { userId: "1" },
  //         (url, queryParams) =>
  //           `${url}${queryParams ? JSON.stringify(queryParams) : ""}`
  //       )
  //     );
  //     await act(async () => {
  //       expect(realFetch).not.toHaveBeenCalled();
  //       expect(result.current.data).toEqual(testData);
  //       expect(result.current.error).toBeNull();
  //       expect(result.current.loading).toBe(false);
  //     });
  //   });

  it("handles fetch errors", async () => {
    const realFetch = fetch as jest.Mock;
    realFetch.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() =>
      useFetch<{ message: string }>(
        "api/test",
        { method: "GET" },
        { userId: "1" }
      )
    );

    await waitFor(() =>
      expect(result.current.error).toEqual(new Error("Network Error"))
    );

    expect(result.current.data).toBeNull();
    expect(result.current.error).toEqual(new Error("Network Error"));
    expect(result.current.loading).toBe(false);
  });
});
