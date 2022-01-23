import { ReactElement } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

import styled from 'styled-components';

import Comments from './Comment';

interface CommentsProp {
  postId: number;
}

function CommentsList(prop: CommentsProp): ReactElement {
  // const dispatch: AppDispatch = useDispatch();
  const comments = useSelector(
    (store: RootState) =>
      store.posts.comments?.filter(
        (c) => c.postId === prop.postId && c.parentCommentId == null,
      ),
    shallowEqual,
  );

  return (
    <CommentsListStyled>
      <div>
        {comments.map((c) => (
          <Comments key={c.id} id={c.id} />
        ))}
      </div>
    </CommentsListStyled>
  );
}

const CommentsListStyled = styled.div``;

export default CommentsList;
