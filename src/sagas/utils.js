async function request(url, method, body=null) {
  const accessToken = localStorage.getItem('access_token');

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? {
        Authorization: `Bearer ${accessToken}`,
      } : {})
    },
    body: body && JSON.stringify(body),
  });

  if (response.status < 500) {
    return response.json();
  } else {
    return response.text();
  }
}

export async function post(url, body) {
  return request(url, 'post', body);
}

export async function patch(url, body) {
  return request(url, 'patch', body);
}

export async function get(url) {
  return request(url, 'get');
}

export const make = (baseUrl) => ({
  post(path, body) {
    return post(`${baseUrl}${path}`, body);
  },
  patch(path, body) {
    return patch(`${baseUrl}${path}`, body);
  },
  get(path) {
    return get(`${baseUrl}${path}`);
  }
});
