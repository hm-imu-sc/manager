export const apiMethodTypes = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE'
}

export const fetchAPI = async (url, method, body={}) => {
    try {
        const request = {
            method: method,
            headers: {'Content-Type': 'application/json'}
        };

        if (method !== apiMethodTypes.GET) {
            request['body'] = JSON.stringify(body);
        }

        const r = await fetch(url, request);
        return await r.json();
    } 
    catch (error) {
        return {
            generalResponse: {
                isSuccess: false,
                message: error.message
            }
        }        
    }
}