import { ReactElement, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';

import { Check2, X } from 'react-bootstrap-icons';
import styled from 'styled-components';
import Post, { PostProp } from './index';
import { postsManageVrrdict } from 'redux/slices/posts';

import SimpleInputForm from '../SimpleInputForm';

export interface PostManageProp
  extends Omit<
    PostProp,
    'commentsCount' | 'viewsCount' | 'clickCommentIcoCb' | 'clickNewCommentCb'
  > {
  className?: string;
}

function ManagePost(prop: PostManageProp): ReactElement {
  const [showSimpleInput, setShowSimpleInput] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setShowSimpleInput(false);
  }, [prop.id]);

  const verdictCb = useCallback(
    async (result: 'ok' | 'ne-ok', reason?: string) => {
      dispatch(
        postsManageVrrdict({
          id: prop.id,
          verdict: {
            result: result,
            reason: reason,
          },
        }),
      );
    },
    [prop, dispatch],
  );

  return (
    <ManagePostStyled>
      <div className={'d-flex flex-row ' + prop.className || ''}>
        <div className="lc">
          <div className="btn-wrapper ok" onClick={() => verdictCb('ok')}>
            <Check2 />
          </div>
          <div
            className="btn-wrapper ne-ok"
            onClick={() => setShowSimpleInput(true)}
          >
            <X />
          </div>
        </div>
        <div className="flex-grow-1 rc">
          <Post {...prop} />
          {!showSimpleInput ? null : (
            <SimpleInputForm
              placeholderText="Enter Reason..."
              submitCd={(text) => verdictCb('ne-ok', text)}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </ManagePostStyled>
  );
}

const ManagePostStyled = styled.div`
  .lc {
    margin-right: 5px;
    font-size: 2em;
  }

  .lc > .btn-wrapper {
    height: 50px;
    width: 70px;
    text-align: center;
    vertical-align: middle;
  }

  .lc > .btn-wrapper.ok:hover {
    background-color: ${({ theme }) => theme.successBgc};
    color: ${({ theme }) => theme.successColor};
  }

  .lc > .btn-wrapper.ne-ok:hover {
    background-color: ${({ theme }) => theme.errorBgc};
    color: ${({ theme }) => theme.errorColor};
  }
`;

export default ManagePost;
