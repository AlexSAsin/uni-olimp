import { useEffect, ReactElement, useState, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';

import SimpleImpotFormlight from 'components/SimpleInputForm/Light';
import {
  postsCommentPost,
  postsDeleteComments,
  uploadPostComments,
} from 'redux/slices/posts';
import { Dash, Plus } from 'react-bootstrap-icons';
import { correctStrDate } from 'utils/time';

interface CommentsProp {
  id: number;
}

type inputAction = 'newComment' | 'deleteComment' | 'null';

function Comments(prop: CommentsProp): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const userRole = useSelector(
    (store: RootState) => store.auth.user?.roleName,
    shallowEqual,
  );

  const childComments = useSelector(
    (store: RootState) =>
      store.posts.comments?.filter((c) => c.parentCommentId === prop.id),
    shallowEqual,
  );

  const curComment = useSelector(
    (store: RootState) =>
      store.posts.comments.filter((c) => c.id === prop.id)[0],
  );

  const [inputAction, setInputAction] = useState<inputAction>('null');
  const [showChilds, setShowChilds] = useState(false);
  const [childsUploaded, setChildsUploaded] = useState(false);

  useEffect(() => {
    // setShowAnswer(false);
    // setShowChilds(false);
  }, [prop]);

  useEffect(() => {
    return () => {
      // dispatch(commentsClearByParentCommentId(prop.id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendAnswerCb = useCallback(
    async (text) => {
      dispatch(
        postsCommentPost({
          content: text,
          parentCommentId: curComment.id,
          postId: curComment.postId,
        }),
      );
      setInputAction('null');
    },
    [dispatch, curComment],
  );

  const uploadChildsCb = useCallback(async () => {
    dispatch(uploadPostComments({ parentCommentId: curComment.id }));
  }, [dispatch, curComment.id]);

  const showHideChildsCb = useCallback(async () => {
    setShowChilds((p) => !p);

    if (childsUploaded) return;
    setChildsUploaded(true);

    uploadChildsCb();
  }, [childsUploaded, uploadChildsCb]);

  const deleteCommentCb = useCallback(
    async (text) => {
      dispatch(postsDeleteComments({ commentId: curComment.id, reason: text }));
    },
    [curComment, dispatch],
  );

  return (
    <CommentsStyled>
      <div className="comment-header mt-2">
        <span className="comment-login me-1">{curComment.owner.login}</span>
        <span className="comment-time-pass">
          {correctStrDate(curComment.updatedAt)}
        </span>
      </div>
      <div className="comment-content">
        <span className="comment-content">{curComment.content}</span>
      </div>
      <div className="comment-actions">
        {inputAction === 'null' ? (
          <span
            className="comment-action-answer"
            onClick={() => setInputAction('newComment')}
          >
            answer
          </span>
        ) : inputAction === 'newComment' ? (
          <span
            className="comment-action-cancle"
            onClick={() => setInputAction('null')}
          >
            cancle
          </span>
        ) : null}
        {userRole !== 'admin' ? null : inputAction === 'null' ? (
          <span
            className="comment-action-delete ms-1"
            onClick={() => setInputAction('deleteComment')}
          >
            delete
          </span>
        ) : inputAction === 'deleteComment' ? (
          <span
            className="comment-action-delete"
            onClick={() => setInputAction('null')}
          >
            cancle
          </span>
        ) : null}
      </div>
      {inputAction === 'null' ? null : (
        <div className="comment-answer">
          <SimpleImpotFormlight
            placeholderText={
              inputAction === 'newComment'
                ? 'Enter commnet...'
                : 'Enter reason...'
            }
            submitText={inputAction === 'newComment' ? 'Send' : 'Delete'}
            submitCd={(text) =>
              (inputAction === 'newComment' ? sendAnswerCb : deleteCommentCb)(
                text,
              )
            }
          />
        </div>
      )}
      {curComment.childsCommentsCount > 0 ? (
        <div className="comment-more">
          <div className="wrapper" onClick={showHideChildsCb}>
            {showChilds ? <Dash /> : <Plus />}
            <span className="count ms-1">
              {curComment.childsCommentsCount} more comments
            </span>
          </div>
          <div className="childs-wrapper ps-3">
            {!showChilds
              ? null
              : childComments.map((c) => <Comments key={c.id} id={c.id} />)}
          </div>
        </div>
      ) : null}
    </CommentsStyled>
  );
}

const CommentsStyled = styled.div`
  .comment-login {
    color: ${({ theme }) => theme.secondColor};
    font-size: 0.9em;
  }

  .comment-time-pass {
    font-size: 0.7em;
  }

  .comment-actions > * {
    font-size: 0.8em;
    cursor: pointer;
  }
  .comment-actions > *:hover {
    text-decoration: underline;
  }

  .comment-action-answer,
  .comment-action-cancle {
    color: ${({ theme }) => theme.successColor};
  }

  .comment-action-delete {
    color: ${({ theme }) => theme.errorColor};
  }

  .comment-more .wrapper {
    display: inline-block;
    cursor: pointer;
  }
  .comment-more .count {
    font-size: 0.8em;
  }
  .comment-more svg {
    border: ${({ theme }) => theme.primaryBorder};
    background-color: ${({ theme }) => theme.bgcBtn};
  }
  .comment-more .childs-wrapper {
    border-left: ${({ theme }) => theme.primaryBorder};
  }
`;

export default Comments;
