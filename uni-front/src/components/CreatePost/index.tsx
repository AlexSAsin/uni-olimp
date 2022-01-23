import { ReactElement, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert, Button, Card, Container, Form } from 'react-bootstrap';

import styled from 'styled-components';

import { AppDispatch, RootState } from 'redux/store';
import { postsPost } from 'redux/slices/posts';

function CreatePost(): ReactElement {
  const userRole = useSelector((store: RootState) => store.auth.user?.roleName);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [error, setError] = useState('');
  const [success, setsuccess] = useState('');

  const dispatch: AppDispatch = useDispatch();

  const createPost = useCallback(
    (withoutVerification: boolean) => async () => {
      try {
        await dispatch(
          postsPost({
            title: title,
            content: content,
            withoutVerification: withoutVerification,
          }),
        ).unwrap();
        setError('');
        setsuccess('Congratulations!');
        setTitle('');
        setContent('');
      } catch (e) {
        setsuccess('');
        const error = e as ErrorResponse;
        switch (error.status) {
          case 400:
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            setError(/\[(.*)\]/.exec(error.message)![1]);
            break;
          case 401:
            setError('How you do it ;)');
            break;
          case 403:
            setError('back is not a fool');
            break;
        }
      }
    },
    [dispatch, title, content],
  );

  return (
    <CreatePostStyled>
      <Container>
        <Card className="p-3 mt-4">
          {!error ? null : <Alert variant="danger">{error}</Alert>}
          {!success ? null : <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group className="mb-1" controlId="formBasicEmail">
              <Form.Label className="mb-0">Title:</Form.Label>
              <Form.Control
                placeholder="Enter title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="mb-0">Content:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Content"
                as="textarea"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="success"
              className="w-100"
              onClick={createPost(false)}
            >
              Send for verification
            </Button>
            {userRole !== 'admin' ? null : (
              <Button
                variant="success"
                className="w-100 mt-2"
                onClick={createPost(true)}
              >
                Send without verification
              </Button>
            )}
          </Form>
        </Card>
      </Container>
    </CreatePostStyled>
  );
}

const CreatePostStyled = styled.div``;

export default CreatePost;
