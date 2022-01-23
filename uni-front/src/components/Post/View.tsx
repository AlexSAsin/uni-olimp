import { ReactElement, useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';

import styled from 'styled-components';
import Post, { PostProp } from './index';
import {
  postsCommentPost,
  postsLike,
  postsView,
  uploadPostComments,
} from 'redux/slices/posts';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import SimpleImpotForm from 'components/SimpleInputForm';
import { Card } from 'react-bootstrap';
import CommentsList from './CommentsList';

export interface PostViewProp
  extends Omit<PostProp, 'clickCommentIcoCb' | 'clickNewCommentCb'> {
  likesSum: number;
  selfLikeValue: number;
  className?: string;
}

function ViewPost(prop: PostViewProp): ReactElement {
  const dispatch: AppDispatch = useDispatch();

  const [viewed, setViewed] = useState(false);
  const [showNewComment, setShowNewComment] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    setShowNewComment(false);
    setShowComments(false);
  }, [prop.id]);

  const likeCb = useCallback(
    (likeValue: 1 | -1) => {
      dispatch(postsLike({ likeValue: likeValue, postId: prop.id }));
    },
    [prop, dispatch],
  );

  const viewCb = useCallback(() => {
    if (viewed) return;
    setViewed(true);
    dispatch(postsView({ postId: prop.id }));
  }, [prop, viewed, dispatch]);

  const newCommentCb = useCallback(
    async (text) => {
      dispatch(
        postsCommentPost({
          content: text,
          postId: prop.id,
          parentCommentId: undefined,
        }),
      );
      setShowNewComment(false);
    },
    [dispatch, prop.id],
  );

  const showCommentsCb = useCallback(() => {
    setShowComments((prev) => !prev);
    dispatch(uploadPostComments({ postId: prop.id }));
  }, [prop.id, dispatch]);

  return (
    <ViewPostStyled>
      <div
        className={'d-flex flex-row ' + prop.className || ''}
        onMouseEnter={viewCb}
      >
        <div className="lc">
          <div
            className={
              'btn-wrapper ok ' + (prop.selfLikeValue === 1 ? 'active' : '')
            }
            onClick={() => likeCb(1)}
          >
            <ChevronUp />
          </div>
          <div className="likesSum">
            <span>
              {prop.likesSum > 0 ? '+' : ''}
              {prop.likesSum}
            </span>
          </div>
          <div
            className={
              'btn-wrapper ne-ok ' + (prop.selfLikeValue === -1 ? 'active' : '')
            }
            onClick={() => likeCb(-1)}
          >
            <ChevronDown />
          </div>
        </div>
        <div className="flex-grow-1 rc">
          <Post
            {...prop}
            clickNewCommentCb={() => setShowNewComment((prev) => !prev)}
            clickCommentIcoCb={showCommentsCb}
          />
          {!showNewComment ? null : (
            <SimpleImpotForm
              placeholderText="Enter your comment"
              submitCd={(text) => newCommentCb(text)}
              className="mt-2"
            />
          )}
          {!showComments ? null : (
            <Card className="mt-2 px-3 py-2">
              <CommentsList postId={prop.id} />
            </Card>
          )}
        </div>
      </div>
    </ViewPostStyled>
  );
}

const ViewPostStyled = styled.div`
  .lc {
    margin-right: 5px;
    font-size: 2em;
  }

  .lc > * {
    text-align: center;
  }

  .lc > .btn-wrapper > svg {
    vertical-align: baseline;
  }

  .lc > .btn-wrapper {
    height: 40px;
    width: 70px;
  }

  .lc > .btn-wrapper.ok:hover,
  .lc > .btn-wrapper.ok.active {
    background-color: ${({ theme }) => theme.successBgc};
    color: ${({ theme }) => theme.successColor};
  }

  .lc > .btn-wrapper.ne-ok:hover,
  .lc > .btn-wrapper.ne-ok.active {
    background-color: ${({ theme }) => theme.errorBgc};
    color: ${({ theme }) => theme.errorColor};
  }
`;

export default ViewPost;
