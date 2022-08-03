import { useState, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authActions, signInAsGuest, signInByGoogle,
  signUpByEmail, signInByEmail, linkGuestToGoogle,
  linkGuestToEmail,
} from 'store/auth-slice';
import Modal from 'component/UI/Modal';
import Button from 'component/UI/Button';
import classes from './AuthModal.module.scss';

const AuthModal = (props) => {
  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isGuest = user && user.isAnonymous;
  const [page, setPage] = useState('all');
  const [error, setError] = useState(null);
  const [hintTextActive, setHintTextActive] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const closeHandler = () => {
    dispatch(
      authActions.setModalActive(false)
    );
  };

  const guestHandler = () => {
    dispatch(
      signInAsGuest(closeHandler)
    );
  };
  
  const googleHandler = () => {
    if (isGuest) {
      dispatch(
        linkGuestToGoogle(closeHandler)
      );
    } else {
      dispatch(
        signInByGoogle(closeHandler)
      );
    }
  };

  const signUpHandler = (e) => {
    e.preventDefault();
    setError(null);
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      setError('確認密碼與密碼不符');
    } else if (isGuest) {
      dispatch(
        linkGuestToEmail(emailRef.current.value, passwordRef.current.value, closeHandler)
      );
    } else {
      dispatch(
        signUpByEmail(emailRef.current.value, passwordRef.current.value, closeHandler)
      );
    }
  };

  const signInHandler = (e) => {
    e.preventDefault();
    dispatch(
      signInByEmail(emailRef.current.value, passwordRef.current.value, closeHandler)
    );
  };

  return (
    <Modal onClose={closeHandler} className={classes.authModal}>
      {
        page === 'all' && isGuest &&
          <section>
            <p>註冊正式帳號以編輯個人資料或新增自選片單</p>
            <p>
              <Button
                icon="fa-brands fa-google"
                text="Google 註冊"
                className="primary"
                onClick={googleHandler}
              />
            </p>
            <p>
              <Button
                icon="fa-solid fa-envelope"
                text="Email 註冊"
                className="primary"
                onClick={() => setPage('signUp')}
              />
            </p>
          </section>
      }
      {
        page === 'all' && !isGuest &&
          <section>
            <p>登入 / 註冊以使用更多功能</p>
            <p>
              <Button
                icon="fa-solid fa-id-card-clip"
                text="使用訪客模式"
                className="primary"
                onClick={guestHandler}
              />
            </p>
            <p>
              <Button
                icon="fa-brands fa-google"
                text="Google 登入 / 註冊"
                className="primary"
                onClick={googleHandler}
              />
            </p>
            <p>
              <Button
                icon="fa-solid fa-envelope"
                text="Email 登入 / 註冊"
                className="primary"
                onClick={() => setPage('signIn')}
              />
            </p>
          </section>
      }
      {
        page !== 'all' &&
          <p
            className={classes.back}
            onClick={() => setPage('all')}
          >
            <i className="fa-solid fa-arrow-left" />
          </p>
      }
      {
        page === 'signIn' &&
          <section>
            <h3>登入</h3>
            <form
              name='signInForm'
              className={classes.form}
              onSubmit={signInHandler}
            >
              <div>
                <label htmlFor="email">Email</label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password">密碼</label>
                <input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  required
                  minLength="6"
                  maxLength="20"
                />
              </div>
              <Button
                text="登入"
                type="submit"
                className="primary"
              />
              <p className={classes.link}>還沒有帳號？
                <span onClick={() => setPage('signUp')}>
                  註冊
                </span>
              </p>
            </form>
          </section>
      }
      {
        page === 'signUp' &&
          <section>
            <h3 style={{ position: 'relative' }}>註冊
                <i
                className={`fa-solid fa-circle-info ${classes.hint}`}
                onClick={() => setHintTextActive(prevState => !prevState)}
              />
              {
                hintTextActive &&
                  <span className={classes.hintText}>此網站僅為展示之用，因此不會寄發註冊驗證信，Email只需符合格式即可</span>
              }
            </h3>
            <form
              name='signUpForm'
              className={classes.form}
              onSubmit={signUpHandler}
            >
              <div>
                <label htmlFor="email">Email</label>
                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="password">密碼</label>
                <input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  required
                  minLength="6"
                  maxLength="20"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword">確認密碼</label>
                <input
                  ref={confirmPasswordRef}
                  id="confirmPassword"
                  type="password"
                  required
                  minLength="6"
                  maxLength="20"
                />
                {
                  error && <p className={classes.error}>{error}</p>
                }
              </div>
              <Button
                text="註冊"
                type="submit"
                className="primary"
              />
              {
                !isGuest &&
                  <p className={classes.link}>已經有帳號了？
                    <span onClick={() => setPage('signIn')}>
                      登入
                    </span>
                  </p>
              }
            </form>
          </section>
      }
    </Modal>
  );
};

export default AuthModal;
