import { useState } from 'react';
import axios from 'axios';
import AddressSelect from "@/global/components/AddressSelect";

const SignUp = () => {
  const [membername, setMembername] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== pwCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('/members/signUp', {
        membername,
        nickname,
        phone,
        password,
        address,
      });

      alert('회원가입 성공');
      window.location.href = '/login';
    } catch (err) {
      console.error(err + "회원가입 실패")
    }
  };

  return (
    <div className="bg-dark min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="mx-auto p-5 bg-white rounded shadow" style={{ maxWidth: 700 }}>
          <div className="bg-dark text-white px-4 py-3 rounded mb-4">
            <h4 className="m-0 fw-bold">회원가입</h4>
          </div>

          <h2 className="text-center fw-bold mb-3 text-success">Plantory</h2>
          <p className="text-center text-muted mb-4">
            식물을 관리하고 커뮤니티를 사용하려면 가입하세요.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="fw-bold">아이디 *</label>
                <input
                    type="text"
                    name="membername"
                    className="form-control"
                    value={membername}
                    onChange={(e) => setMembername(e.target.value)}
                    required
                />
              </div>

              <div className="row g-3">
                <AddressSelect onChange={setAddress} />
              </div>

              <div className="col-md-6">
                <label className="fw-bold">닉네임 *</label>
                <input
                    type="text"
                    name="nickname"
                    className="form-control"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />

              </div>

              <div className="col-md-6">
                <label className="fw-bold">휴대전화 *</label>
                <input
                  className="form-control"
                  placeholder="010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold">비밀번호 *</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="fw-bold">비밀번호 확인 *</label>
                <input
                  type="password"
                  className="form-control"
                  value={pwCheck}
                  onChange={(e) => setPwCheck(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-success w-100 mt-4">가입하기</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
