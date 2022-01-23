import { ReactElement, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { postsGetManage, postsManageClear } from 'redux/slices/posts';
import { AppDispatch, RootState } from 'redux/store';

import styled from 'styled-components';
import ManagePost from './Manage';

function ListManagePosts(): ReactElement {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((store: RootState) => store.posts.postsManage);

  useEffect(() => {
    dispatch(
      postsGetManage({
        verificationResult: 'null',
      }),
    );

    return () => {
      postsManageClear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListPostsStyled>
      <Container className="mt-4">
        {posts?.map((post, ind) => (
          <ManagePost key={ind} {...post} className="mt-4" />
        ))}
        <div></div>
      </Container>
    </ListPostsStyled>
  );
}

const ListPostsStyled = styled.div``;

export default ListManagePosts;
