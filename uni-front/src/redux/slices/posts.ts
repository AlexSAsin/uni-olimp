import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import { Taxios } from '@simplesmiler/taxios';
import Axios from 'axios';
import { store } from 'redux/store';
import { apiUrl } from 'utils/consts';

// Types

export type PostManage = {
  id: number;
  title: string;
  content: string;
  owner: {
    id: number;
    login: string;
  };
  updatedAt: string;
  latsVerification: {
    id: number;
    result: boolean;
    reason: string;
  } | null;
};

export type PostView = PostManage & {
  likesSum: number;
  commentsCount: number;
  viewsCount: number;
  selfLikeValue: number;
};

export type Comment = {
  id: number;
  postId: number;
  content: string;
  updatedAt: string;
  parentCommentId: number | null;
  owner: {
    id: number;
    login: string;
  };
  childsCommentsCount: number;
};

export type PostState = {
  status: string;
  postsManage: PostManage[];
  postsView: PostView[];
  comments: Comment[];
};

// Init state

const initialState: PostState = {
  status: 'idle',
  postsManage: [],
  postsView: [],
  comments: [],
};

// Thunk functions

const taxios = new Taxios<Swagger>(Axios.create({ baseURL: apiUrl }));

export const postsPost = createAsyncThunk(
  'posts/send',
  async (
    post: {
      title: string;
      content: string;
      withoutVerification?: boolean;
    },
    api,
  ) => {
    try {
      const response = await taxios.post(
        '/posts',
        {
          ...post,
        },
        {
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return {
        postId: response.data.id,
      };
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsPatchValidated = createAsyncThunk(
  'post/update/validation',
  async (
    post: {
      id: number;
      result: boolean;
      reason?: string;
    },
    api,
  ) => {
    post;
    api;
    try {
      await taxios.patch(
        '/posts/{id}/verification',
        {
          result: post.result,
          reason: post.reason,
        },
        {
          params: {
            id: post.id,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return true;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsGetManage = createAsyncThunk(
  'posts/manage/get',
  async (query: { verificationResult: 'true' | 'false' | 'null' }, api) => {
    try {
      const posts = await taxios.get('/posts/manage', {
        query: {
          verificationResult: query.verificationResult,
        },
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return posts.data as PostManage[];
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsGetView = createAsyncThunk(
  'posts/get',
  async (query: { verificationResult: 'true' | 'false' | 'null' }, api) => {
    try {
      const posts = await taxios.get('/posts', {
        query: {
          verificationResult: query.verificationResult,
        },
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return posts.data as PostView[];
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsManageVrrdict = createAsyncThunk(
  'posts/manage/verdict',
  async (
    post: { id: number; verdict: { result: 'ok' | 'ne-ok'; reason?: string } },
    api,
  ) => {
    try {
      taxios.patch(
        '/posts/{id}/verification',
        {
          result: post.verdict.result === 'ok',
          reason: post.verdict.reason,
        },
        {
          params: {
            id: post.id,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return post.id;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsLike = createAsyncThunk(
  'posts/like',
  async (
    post: {
      likeValue: 1 | -1;
      postId: number;
    },
    api,
  ) => {
    try {
      const response = await taxios.post(
        '/posts/{id}/like',
        {
          value: post.likeValue,
        },
        {
          params: {
            id: post.postId,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsView = createAsyncThunk(
  'posts/view',
  async (
    post: {
      postId: number;
    },
    api,
  ) => {
    try {
      const response = await taxios.post(
        '/posts/{id}/incrementView',
        undefined,
        {
          params: {
            id: post.postId,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsCommentPost = createAsyncThunk(
  'posts/comments/post',
  async (
    comment: {
      postId: number;
      content: string;
      parentCommentId: number | undefined;
    },
    api,
  ) => {
    comment;
    api;
    try {
      const response = await taxios.post(
        '/posts/{id}/comments',
        {
          content: comment.content,
          parentCommentId: comment.parentCommentId,
        },
        {
          params: {
            id: comment.postId,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        },
      );
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const uploadPostComments = createAsyncThunk(
  'posts/comments/upload',
  async (
    comments: {
      postId?: number;
      parentCommentId?: number;
    } & object,
    api,
  ) => {
    comments;
    api;
    try {
      if (comments.postId !== undefined) {
        let response = await taxios.get('/posts/{id}/comments', {
          params: {
            id: comments.postId,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        });
        return response.data;
      } else {
        let response = await taxios.get('/comments/{id}/childs', {
          params: {
            id: comments.parentCommentId ?? -1,
          },
          axios: {
            headers: {
              authorization: 'Bearer ' + store.getState().auth.jwt,
            },
          },
        });
        return response.data;
      }
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

export const postsDeleteComments = createAsyncThunk(
  'posts/comments/delete',
  async (
    toDelete: {
      commentId: number;
      reason: string;
    },
    api,
  ) => {
    try {
      let response = await taxios.delete('/comments/{id}', {
        query: {
          reason: toDelete.reason,
        },
        params: {
          id: toDelete.commentId,
        },
        axios: {
          headers: {
            authorization: 'Bearer ' + store.getState().auth.jwt,
          },
        },
      });
      return response.data;
    } catch (e) {
      return api.rejectWithValue({
        status: e.response.data.status,
        message: e.response.data.message,
      });
    }
  },
);

// Slice

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsManageClear(state: PostState) {
      state.postsManage = [];
    },
    postsViewClear(state: PostState) {
      state.postsView = [];
    },
    commentsClearByPostId(state: PostState, action: PayloadAction<number>) {
      state.comments = state.comments.filter(
        (c) => c.postId !== action.payload,
      );
    },
    commentsClearByParentCommentId(
      state: PostState,
      action: PayloadAction<number>,
    ) {
      state.comments = state.comments.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postsGetManage.pending, (state: PostState) => {
        state.status = 'loading';
      })
      .addCase(postsGetManage.fulfilled, (state: PostState, action) => {
        state.status = 'idle';
        state.postsManage = action.payload;
      })
      .addCase(postsPost.rejected, (state: PostState) => {
        state.status = 'idle';
      });
    builder
      .addCase(postsGetView.pending, (state: PostState) => {
        state.status = 'loading';
      })
      .addCase(postsGetView.fulfilled, (state: PostState, action) => {
        state.status = 'idle';
        state.postsView = action.payload;
      })
      .addCase(postsGetView.rejected, (state: PostState) => {
        state.status = 'idle';
      });
    builder.addCase(
      postsManageVrrdict.fulfilled,
      (state: PostState, action) => {
        state.postsManage = state.postsManage.filter(
          (p) => p.id !== action.payload,
        );
      },
    );
    builder.addCase(postsLike.fulfilled, (state: PostState, action) => {
      const postInd =
        state.postsView.reduce(
          (p, n, i) => (n.id !== action.meta.arg.postId ? p : i),
          -1,
        ) ?? -1;
      if (postInd === -1) return;
      if (state.postsView !== undefined) {
        state.postsView[postInd].likesSum = action.payload.currentSumLikes;
        state.postsView[postInd].selfLikeValue =
          action.payload.currentSelfLikeValue;
      }
    });
    builder.addCase(postsView.fulfilled, (state: PostState, action) => {
      const postInd =
        state.postsView.reduce(
          (p, n, i) => (n.id !== action.meta.arg.postId ? p : i),
          -1,
        ) ?? -1;
      if (postInd === -1) return;
      if (state.postsView !== undefined) {
        state.postsView[postInd].viewsCount = action.payload.currentViewsCount;
      }
    });

    builder.addCase(postsCommentPost.fulfilled, (state: PostState, action) => {
      const postInd =
        state.postsView.reduce(
          (p, n, i) => (n.id !== action.payload.postId ? p : i),
          -1,
        ) ?? -1;
      if (postInd !== -1) {
        state.postsView[postInd].commentsCount += 1;
      }
      const commentInd =
        state.comments.reduce(
          (p, n, i) => (n.id !== action.payload.parentCommentId ? p : i),
          -1,
        ) ?? -1;
      if (commentInd !== -1) {
        state.comments[commentInd].childsCommentsCount += 1;
      }
      state.comments.push(action.payload);
    });

    builder.addCase(
      uploadPostComments.fulfilled,
      (state: PostState, action) => {
        action.payload.forEach((c) => {
          if (
            !state.comments.reduce(
              (prev, cur) => prev || cur.id === c.id,
              false,
            )
          ) {
            state.comments.push(c);
          }
        });
      },
    );

    builder.addCase(
      postsDeleteComments.fulfilled,
      (state: PostState, action) => {
        state.comments = state.comments.filter(
          (c) => c.id !== action.meta.arg.commentId,
        );
      },
    );
  },
});

export const {
  postsManageClear,
  postsViewClear,
  commentsClearByPostId,
  commentsClearByParentCommentId,
} = postsSlice.actions;

export default postsSlice.reducer;
