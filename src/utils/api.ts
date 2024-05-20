export function callApi(endpoint:string, token:string) {

    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('Calling web API...');

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => {

            if (response) {
                console.log('Web API responded: ',response);
            }

            return response;
        }).catch(error => {
            console.error(error);
        });
}