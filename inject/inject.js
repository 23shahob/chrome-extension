// inject/inject.js

(function () {
    // Override fetch
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args).then((response) => {
        const clonedResponse = response.clone();
        if (clonedResponse.ok && args[0] && clonedResponse.type === 'basic') {
          const method = (args[1] && args[1].method) || 'GET';
          if (method === 'POST') {
            clonedResponse
              .json()
              .then((data) => {
                window.postMessage(
                  {
                    type: 'POST_RESPONSE',
                    payload: data,
                    url: clonedResponse.url
                  },
                  '*'
                );
              })
              .catch((err) => console.error('Error parsing response JSON:', err));
          }
        }
        return response;
      });
    };

    // Override XMLHttpRequest
    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._method = method;
      this.addEventListener('load', function () {
        if (this._method === 'POST' && this.responseType === '' || this.responseType === 'text') {
          try {
            const data = JSON.parse(this.responseText);
            window.postMessage(
              {
                type: 'POST_RESPONSE',
                payload: data,
                url: this.responseURL
              },
              '*'
            );
          } catch (err) {
            console.error('Error parsing XHR response JSON:', err);
          }
        }
      });
      return originalXHR.apply(this, [method, url, ...rest]);
    };
  })();
