declare namespace Project {
    type User = {
        id: number;
        name: string;
        login: string;
        password: string;
        email: string;
    };

    type Resource = {
        id: number;
        name: string;
        resourceKey: string;
    };
}
