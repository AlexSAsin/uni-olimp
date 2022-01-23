declare global {
  export namespace Swagger {
    /**
     * object with detail of error
     */
    export interface ErrorResponse {
      status: number;
      /**
       * error detail
       */
      message: string;
      success: boolean;
      reason: string;
    }
    /**
     * User date to authorizate
     */
    export interface UserAuthorization {
      login: string;
      password: string;
    }
    export interface PostGetManage {
      id: number;
      title: string;
      content: string;
      owner: Swagger.Owner;
      updatedAt: string;
      latsVerification: Swagger.LastVerification;
    }
    export interface PostGetView {
      id: number;
      title: string;
      content: string;
      owner: Swagger.Owner;
      updatedAt: string;
      latsVerification: Swagger.LastVerification;
      likesSum: number;
      commentsCount: number;
      viewsCount: number;
    }
    export interface CommentsGet {
      id: number;
      postId: number;
      owner: Swagger.Owner;
      parentCommentId: number;
      content: string;
      updatedAt: string;
      childsCommentsCount: number;
    }
    export interface Owner {
      id: number;
      login: string;
    }
    export interface LastVerification {
      id: number;
      result: boolean;
      reason: string;
    }
    export interface AlertsGet {
      id: number;
      level: 'error' | 'success' | 'info';
      updatedAt: string;
      title: string;
      post: Swagger.PostAlertGet;
      comment1: Swagger.CommentAlertGet;
      comment2: Swagger.CommentAlertGet;
      reason: string;
    }
    export interface PostAlertGet {
      id: number;
      title: string;
      content: string;
      owner: Swagger.Owner;
      updatedAt: string;
    }
    export interface CommentAlertGet {
      id: number;
      owner: Swagger.Owner;
      content: string;
      updatedAt: string;
    }
  }

  export interface Swagger {
    version: '1';
    routes: {
      '/authorization/login': {
        POST: {
          body: Swagger.UserAuthorization;
          response: {
            /**
             * jwt token
             */
            token: string;
          };
        };
      };
      '/posts': {
        GET: {
          query?: {
            verificationResult?: 'null' | 'true' | 'false';
          };
          response: Swagger.PostGetView[];
        };
        POST: {
          body?: {
            title: string;
            content: string;
            withoutVerification?: boolean;
          };
          response: {
            id: number;
          };
        };
      };
      '/posts/manage': {
        GET: {
          query?: {
            verificationResult?: 'null' | 'true' | 'false';
          };
          response: Swagger.PostGetManage[];
        };
      };
      '/posts/{id}/verification': {
        PATCH: {
          body?: {
            result: boolean;
            reason?: string;
          };
          params: {
            id: number;
          };
        };
      };
      '/posts/{id}/like': {
        POST: {
          body?: {
            value: -1 | 1;
          };
          params: {
            id: number;
          };
          response: {
            currentSelfLikeValue: number;
            currentSumLikes: number;
          };
        };
      };
      '/posts/{id}/incrementView': {
        POST: {
          params: {
            id: number;
          };
          response: {
            currentViewsCount: number;
          };
        };
      };
      '/posts/{id}/comments': {
        GET: {
          params: {
            id: number;
          };
          response: Swagger.CommentsGet[];
        };
        POST: {
          body?: {
            content: string;
            parentCommentId?: number;
          };
          params: {
            id: number;
          };
          response: Swagger.CommentsGet;
        };
      };
      '/comments/{id}/childs': {
        GET: {
          params: {
            id: number;
          };
          response: Swagger.CommentsGet[];
        };
      };
      '/comments/{id}': {
        DELETE: {
          params: {
            id: number;
          };
          query: {
            reason: string;
          };
        };
      };
      '/alerts': {
        GET: {
          response: Swagger.AlertsGet[];
        };
      };
      '/alerts/{id}': {
        PATCH: {
          body?: {
            viewed?: boolean;
          };
          params: {
            id: string;
          };
        };
      };
      '/alerts/count': {
        GET: {
          response: {
            count: number;
          };
        };
      };
      '/roles': {
        GET: {
          response: {
            roleName: string;
          }[];
        };
      };
    };
  }
}

export {};
