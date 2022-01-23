import { ReactElement, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { postsGetView, postsViewClear } from 'redux/slices/posts';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';
import ViewPost from './View';

function ListViewPosts(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((store: RootState) => store.posts.postsView);

  useEffect(() => {
    dispatch(
      postsGetView({
        verificationResult: 'true',
      }),
    );

    return () => {
      postsViewClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListPostsStyled>
      <Container className="mt-4">
        {posts?.map((post, ind) => (
          <ViewPost key={ind} {...post} className="mt-4" />
        ))}
        <div></div>
      </Container>
    </ListPostsStyled>
  );
}

const ListPostsStyled = styled.div``;

export default ListViewPosts;
