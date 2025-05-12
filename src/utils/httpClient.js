import axios from "axios";
import StorageUtils from "./storageUtils";

const accessToken = StorageUtils.get("access_token");
let cancelToken;
const ongoingRequests = new Map();

export const HttpClient = {
  get: async ({
    url,
    headers = {},
    success = (response) => {
      console.log(response);
    },
    failure = (error) => {
      HandleHttpErrors(error);
    },
  }) => {
    if (ongoingRequests.has(url)) {
      const cancelToken = ongoingRequests.get(url);
      cancelToken.cancel("Operation canceled due to new request.");
    }

    const cancelToken = axios.CancelToken.source();
    ongoingRequests.set(url, cancelToken);
    try {
      headers = {
        ...headers,
        cancelToken: cancelToken?.token,
        headers: {
          ...headers.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios.get(url, headers);
      success(response);
      ongoingRequests.delete(url);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        failure(error);
        ongoingRequests.delete(url);
      }
    }
  },

  post: async ({
    url,
    payload = {},
    headers = {},
    success = (response) => {
      console.log(response);
    },
    failure = (error) => {
      HandleHttpErrors(error);
    },
  }) => {
    if (ongoingRequests.has(url)) {
      const cancelToken = ongoingRequests.get(url);
      cancelToken.cancel("Operation canceled due to new request.");
    }

    const cancelToken = axios.CancelToken.source();
    ongoingRequests.set(url, cancelToken);

    try {
      headers = {
        ...headers,
        cancelToken: cancelToken?.token,
        headers: {
          ...headers.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (payload instanceof FormData) {
        headers.headers["Content-Type"] = "multipart/form-data";
      }
      const response = await axios.post(url, payload, headers);
      success(response);
      ongoingRequests.delete(url);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        failure(error);
        ongoingRequests.delete(url);
      }
    }
  },

  put: async ({
    url,
    payload = {},
    headers = {},
    success = () => {},
    failure = (error) => {
      HandleHttpErrors(error);
    },
  }) => {
    if (ongoingRequests.has(url)) {
      const cancelToken = ongoingRequests.get(url);
      cancelToken.cancel("Operation canceled due to new request.");
    }

    const cancelToken = axios.CancelToken.source();
    ongoingRequests.set(url, cancelToken);

    try {
      headers = {
        ...headers,
        headers: {
          ...headers.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      if (payload instanceof FormData) {
        headers.headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axios.put(url, payload, headers);
      success(response);
      ongoingRequests.delete(url);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        failure(error);
        ongoingRequests.delete(url);
      }
    }
  },

  delete: async function ({
    url,
    payload = {},
    headers = {},
    success = () => {},
    failure = (error) => {
      HandleHttpErrors(error);
    },
  }) {
    if (ongoingRequests.has(url)) {
      const cancelToken = ongoingRequests.get(url);
      cancelToken.cancel("Operation canceled due to new request.");
    }

    const cancelToken = axios.CancelToken.source();
    ongoingRequests.set(url, cancelToken);
    headers = {
      ...headers,
      cancelToken: cancelToken?.token,
      headers: {
        ...headers.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await axios.delete(url, {
        data: payload,
        ...headers,
      });
      success(response);
      ongoingRequests.delete(url);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        failure(error);
        ongoingRequests.delete(url);
      }
    }
  },
};

// Error handling function
const HandleHttpErrors = (error, final_callback = () => {}) => {
  final_callback();
};

export default HttpClient;
