import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children, titleType = 'main' }) => {
    const titleClass =
      titleType === 'digits'
        ? 'text text_type_digits-default'
        : 'text text_type_main-large';

    return (
      <>
        <div className={styles.modal}>
          <div className={styles.header}>
            <h3 className={`${styles.title} ${titleClass}`}>{title}</h3>
            <button className={styles.button} type='button'>
              <CloseIcon type='primary' onClick={onClose} />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
