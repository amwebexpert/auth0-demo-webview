class WebUtils {
    public buildURL(url: string): string {
        const timestamp = new Date().getTime();
        return `${url}?timestamp=${timestamp}`;
    };

    public logAndReject(e: any, reject: (reason?: any) => void) {
        const msg = `Rejecting promise. ${e}`;
        console.log(msg);
        reject(msg);
    }

    public httpGetResponseHandler(response: Response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
    }
}

// Singleton export
export default new WebUtils();
