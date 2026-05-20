export async function fetchNui<T = any>(eventName: string, data?: any, mockData?: T): Promise<T> {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify(data),
    };

    const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'ox_target';

    try {
        const resp = await fetch(`https://${resourceName}/${eventName}`, options);
        return await resp.json();
    } catch (error) {
        if (mockData) return mockData;
        throw error;
    }
}
