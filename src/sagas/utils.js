async function request(url, method, body=null) {
  const accessToken = localStorage.getItem('access_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? {
        Authorization: `Bearer ${accessToken}`,
    } : {})
  };

  if (body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    method,
    headers,
    body: headers['Content-Type'] === 'application/json' ? (body && JSON.stringify(body)) : body,
  });

  if (response.status < 500) {
    return response.json();
  } else {
    return response.text();
  }
}

export async function post(url, body) {
  return request(url, 'POST', body);
}

export async function patch(url, body) {
  return request(url, 'PATCH', body);
}

export async function put(url, body) {
  return request(url, 'PUT', body);
}

export async function get(url) {
  return request(url, 'GET');
}

export const make = (baseUrl) => ({
  post(path, body) {
    return post(`${baseUrl}${path}`, body);
  },
  patch(path, body) {
    return patch(`${baseUrl}${path}`, body);
  },
  put(path, body) {
    return put(`${baseUrl}${path}`, body);
  },
  get(path) {
    return get(`${baseUrl}${path}`);
  }
});
