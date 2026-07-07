export const API = 'http://localhost:8000'

export class ApiError extends Error {
    public statusCode: number;
    public message: string;
    public originalError?: unknown;

    constructor(statusCode: number, message: string, originalError?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.originalError = originalError;
        this.name = 'ApiError';
    }
}

interface FetchApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: unknown | FormData
    headers?: Record<string, string>
}

const fetchApi = async <T>(url: string, options: FetchApiOptions = {}): Promise<T> => {
    const { method = 'GET', body, headers: extraHeaders } = options
    const isFormData = body instanceof FormData
    const token = localStorage.getItem('token')
    const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body !== undefined && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...extraHeaders,
    }
    try {
        const response = await fetch(url, {
            method,
            headers: Object.keys(headers).length ? headers : undefined,
            body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
        });

        if (!response.ok) {
            throw new ApiError(
                response.status,
                `HTTP Error: ${response.status} ${response.statusText}`
            );
        }

        if (response.status === 204 || response.statusText === 'No Content') {
            return [] as unknown as T;
        }

        const data = await response.json() as T;
        return data ?? ([] as unknown as T);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        if (error instanceof SyntaxError) {
            throw new ApiError(0, 'Failed to parse response JSON', error);
        }

        if (error instanceof TypeError) {
            throw new ApiError(0, 'Network request failed', error);
        }

        throw new ApiError(0, 'An unknown error occurred', error);
    }
};

interface IGetPost {
    title: string,
    content: string,
    id: 0,
    user_id: 0,
    date_posted: string,
    author: {
        username: string,
        email: string,
        id: 0,
        image_file: string,
        image_path: string
    }
}

export interface ICreatePost {
    title:string,
    content:string,
    user_id: number
}

export interface IUpdatePost {
    title: string
    content: string
}

export interface IPaginatedPosts {
    posts: IGetPost[]
    total: number
    skip: number
    limit: number
    has_more: boolean
}

export const getPosts = async (skip = 0, limit = 10): Promise<IPaginatedPosts> => {
    return fetchApi<IPaginatedPosts>(`${API}/api/posts?skip=${skip}&limit=${limit}`)
}

export const getPost = async (id: number): Promise<IGetPost> => {
    return fetchApi<IGetPost>(`${API}/api/posts/${id}`)
}   

export const getUserPosts = async(user_id:number):Promise<IGetPost[]> => {
    return fetchApi<IGetPost[]>(`${API}/api/users/${user_id}/posts`)
}

export const deletePosts = async(post_id:number):Promise<void> => {
    return fetchApi<void>(`${API}/api/posts/${post_id}`, {
        method: 'DELETE'
    })
}

export const createPost = async(createData: ICreatePost):Promise<void> => {
    return fetchApi<void>(`${API}/api/posts`, {
        method: 'POST',
        body: createData
    })
}

export const updatePost = async(post_id: number, updateData: IUpdatePost): Promise<IGetPost> => {
    return fetchApi<IGetPost>(`${API}/api/posts/${post_id}`, {
        method: 'PATCH',
        body: updateData
    })
}

export interface IUser {
    id: number
    username: string
    email: string
    image_file: string
    image_path: string
}

interface ITokenResponse {
    access_token: string
    token_type: string  
}

export const login = async (username: string, password: string): Promise<ITokenResponse> => {
    const body = new URLSearchParams({ username, password })
    const response = await fetch(`${API}/api/users/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
    })
    if (!response.ok) {
        throw new ApiError(response.status, `HTTP Error: ${response.status} ${response.statusText}`)
    }
    return response.json() as Promise<ITokenResponse>
}

export const getMe = async (): Promise<IUser> => {
    return fetchApi<IUser>(`${API}/api/users/me`)
}

export const register = async(new_user: FormData): Promise<void> => {
    await fetchApi(`${API}/api/users`, {
        method: 'POST',
        body: Object.fromEntries(new_user.entries())
    })
}

export const uploadProfilePicture = async (user_id: number, file: File): Promise<IUser> => {
    const formData = new FormData()
    formData.append('file', file)
    return fetchApi<IUser>(`${API}/api/users/${user_id}/picture`, {
        method: 'PATCH',
        body: formData
    })
}

export const deleteProfilePicture = async (user_id: number): Promise<IUser> => {
    return fetchApi<IUser>(`${API}/api/users/${user_id}/picture`, {
        method: 'DELETE'
    })
}
