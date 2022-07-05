import './Footer.css'
import { coracao } from '../../assets/img/ImportImg'
import { useNavigate } from 'react-router-dom';

export default function Footer () {
  const navigation = useNavigate();

  function linkParaSobre () {
    navigation(`/sobre`);

  }

  return (
    <div className='Footer-container'>
      <p>{coracao} <a href="https://github.com/rafaelcastrobr/Assisto-series">Criado por Rafael Castro</a></p>
      <button onClick={linkParaSobre} className='Footer-container-btn'>sobre</button>
    </div>
  )
}