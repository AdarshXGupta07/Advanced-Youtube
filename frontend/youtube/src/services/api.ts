// API service layer for YVideo frontend
// This handles all communication with the backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Generic API request helper
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // File upload method
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers = {
      ...this.getAuthHeaders(),
      // Don't set Content-Type for FormData - browser will set it with boundary
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Type definitions based on backend models
export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  owner: User;
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  videoFilePublicId?: string;
  duration?: number;
}

export interface Comment {
  _id: string;
  content: string;
  owner: User;
  video: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  _id: string;
  video?: string;
  comment?: string;
  tweet?: string;
  likedBy: User;
  createdAt: string;
}

// API Services
export const authService = {
  // User authentication
  register: (userData: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }) => apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/users/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post<{ user: User; accessToken: string; refreshToken: string }>('/users/login', credentials),

  logout: () => apiClient.post('/users/logout'),

  refreshAccessToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string; refreshToken: string }>('/users/refresh-token', { refreshToken }),

  getCurrentUser: () => apiClient.get<User>('/users/current-user'),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiClient.post('/users/change-password', data),

  updateProfile: (data: { fullName?: string; email?: string }) =>
    apiClient.patch('/users/update-details', data),

  updateAvatar: (avatarFile: File) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiClient.uploadFile<{ user: User }>('/users/update-avatar', formData);
  },

  updateCoverImage: (coverImageFile: File) => {
    const formData = new FormData();
    formData.append('coverImage', coverImageFile);
    return apiClient.uploadFile<{ user: User }>('/users/update-cover-image', formData);
  },

  getChannelProfile: (username: string) => apiClient.get<User>(`/users/channel/${username}`),

  getWatchHistory: () => apiClient.get<Video[]>('/users/watch-history'),
};

export const videoService = {
  // Video operations
  getAllVideos: (params?: {
    page?: number;
    limit?: number;
    query?: string;
    sortBy?: string;
    sortType?: string;
  }) => {
    const searchParams = params ? 
      Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ) : undefined;
    return apiClient.get<{ videos: Video[]; hasNextPage: boolean; totalPages: number }>('/videos', searchParams);
  },

  getVideoById: (videoId: string) => apiClient.get<Video>(`/videos/${videoId}`),

  publishVideo: (videoData: {
    title: string;
    description: string;
    videoFile: File;
    thumbnail: File;
  }) => {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('videoFile', videoData.videoFile);
    formData.append('thumbnail', videoData.thumbnail);
    return apiClient.uploadFile<Video>('/videos', formData);
  },

  updateVideo: (videoId: string, data: { title?: string; description?: string; thumbnail?: File }) => {
    if (data.thumbnail) {
      const formData = new FormData();
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      formData.append('thumbnail', data.thumbnail);
      return apiClient.uploadFile<Video>(`/videos/${videoId}`, formData);
    }
    return apiClient.patch<Video>(`/videos/${videoId}`, data);
  },

  deleteVideo: (videoId: string) => apiClient.delete(`/videos/${videoId}`),

  togglePublishStatus: (videoId: string) => apiClient.patch<Video>(`/videos/toggle/publish/${videoId}`),
};

export const commentService = {
  getVideoComments: (videoId: string, params?: { page?: number; limit?: number }) => {
    const searchParams = params ? 
      Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [key, String(value)])
      ) : undefined;
    return apiClient.get<{ comments: Comment[]; hasNextPage: boolean }>(`/comments/${videoId}`, searchParams);
  },

  addComment: (videoId: string, content: string) =>
    apiClient.post<Comment>(`/comments/${videoId}`, { content }),

  updateComment: (commentId: string, content: string) =>
    apiClient.patch<Comment>(`/comments/c/${commentId}`, { content }),

  deleteComment: (commentId: string) => apiClient.delete(`/comments/c/${commentId}`),
};

export const likeService = {
  toggleVideoLike: (videoId: string) => apiClient.post<{ isLiked: boolean }>(`/likes/toggle/v/${videoId}`),

  toggleCommentLike: (commentId: string) => apiClient.post<{ isLiked: boolean }>(`/likes/toggle/c/${commentId}`),

  getLikedVideos: () => apiClient.get<Video[]>('/likes/videos'),

  getVideoLikes: (videoId: string) => apiClient.get<{ likes: Like[]; count: number }>(`/likes/v/${videoId}`),
};

export const subscriptionService = {
  toggleSubscription: (channelId: string) => apiClient.post<{ isSubscribed: boolean }>(`/subscriptions/c/${channelId}`),

  getUserSubscriptions: () => apiClient.get<{ channels: User[] }>('/subscriptions/u'),

  getChannelSubscribers: (channelId: string) => apiClient.get<{ subscribers: User[]; count: number }>(`/subscriptions/c/${channelId}`),
};

export const playlistService = {
  createPlaylist: (data: { name: string; description: string }) =>
    apiClient.post('/playlist', data),

  getUserPlaylists: () => apiClient.get('/playlist/user/playlists'),

  getPlaylistById: (playlistId: string) => apiClient.get(`/playlist/${playlistId}`),

  updatePlaylist: (playlistId: string, data: { name?: string; description?: string }) =>
    apiClient.patch(`/playlist/${playlistId}`, data),

  deletePlaylist: (playlistId: string) => apiClient.delete(`/playlist/${playlistId}`),

  addVideoToPlaylist: (playlistId: string, videoId: string) =>
    apiClient.post(`/playlist/add/${playlistId}/${videoId}`),

  removeVideoFromPlaylist: (playlistId: string, videoId: string) =>
    apiClient.post(`/playlist/remove/${playlistId}/${videoId}`),
};

export default apiClient;
