import { useState, ReactElement } from 'react';
import { Button, Form } from 'react-bootstrap';

import styled from 'styled-components';

interface SimpleIMpotFormProp {
  placeholderText: string;
  submitCd: (text: string) => unknown;
  className?: string;
  submitText?: string;
}

function SimpleImpotFormlight(prop: SimpleIMpotFormProp): ReactElement {
  const [text, setText] = useState('');

  return (
    <div className={prop.className ?? ''}>
      <SimpleIMpotFormStyled>
        <Form>
          <Form.Group controlId="formSimpleInput">
            <Form.Control
              placeholder={prop.placeholderText}
              as="textarea"
              className="rounded-0"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="success"
            className="w-100 rounded-0"
            onClick={() => prop.submitCd(text)}
          >
            {prop.submitText !== undefined ? prop.submitText : 'Send'}
          </Button>
        </Form>
      </SimpleIMpotFormStyled>
    </div>
  );
}

const SimpleIMpotFormStyled = styled.div`
  .card {
    background-color: ${({ theme }) => theme.primaryBgc};
    border: ${({ theme }) => theme.primaryBorder};
  }
`;

export default SimpleImpotFormlight;
