import {
    useInfiniteQuery,
    useMutation, useQuery,
    useQueryClient,
} from '@tanstack/react-query'

import {INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
import {
    createUserAccount,
    signInAccount,
    signOutAccount,
    createPost,
    updatePost,
    getRecentPosts,
    likePost,
    deleteSavedPost,
    savePost,
    getCurrentUser,
    getUserById,
    getPostById,
    getUserPosts,
    deletePost,
    searchPosts,
    getInfinitePosts, getUsers, updateUser
} from "@/lib/appwrite/api.ts";
import {QUERY_KEYS} from "@/lib/react-query/queryKeys.ts";

export const useCreateUserAccount = () =>{
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}
export const useSignInAccount = () =>{
    return useMutation({
        mutationFn: (user: {
                             email: string,
                             password: string,
                         }) => signInAccount(user)
    })
}
export const useSignOutAccount = () =>{
    return useMutation({
        mutationFn: signOutAccount
    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};
export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
        },
    });
};
export const useGetRecentPosts = ()=>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    });
};
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( savedRecordedId: string) =>
            deleteSavedPost(savedRecordedId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        },
    });
};

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({
                         postId,
                         likesArray,
                     }: {
            postId: string;
            likesArray: string[];
        }) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};
    export const useSavePost = () => {
        const queryClient = useQueryClient();
        return useMutation({
            mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
                savePost(userId, postId),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                });
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_POSTS],
                });
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
                });
            },
        });
    };
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    });
};
export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};
export const useGetPostById = (postId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
    });
};
export const useGetUserPosts = (userId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
        queryFn: () => getUserPosts(userId),
        enabled: !!userId,
    });
};
export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
            deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
        },
    });
};
export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm,
    });
};
export const useGetPosts = () => {
    return useInfiniteQuery({
        // The initial parameter, could be page number, or any other identifier for first page
        initialPageParam: 0,  // Add a suitable starting parameter (for example, 0 or 1)

        getNextPageParam: (lastPage: any) => {
            if (lastPage && lastPage.documents.length === 0) {
                return null; // No more pages
            }

            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
        queryFn: getInfinitePosts as any,  // Define the function that fetches the data
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],  // Your query key
    });
};
export const useGetUsers = (limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit),
    });
};
export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
            });
        },
    });
};
