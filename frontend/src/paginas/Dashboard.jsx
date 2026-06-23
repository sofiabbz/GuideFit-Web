import { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard() {
  const nomeUsuario = localStorage.getItem("usuarioNome") || "Usuário";

  const [temPlanoGerado, setTemPlanoGerado] = useState(false);
  const [diaAtivo, setDiaAtivo] = useState("Segunda-feira");

  const [modalVideoAberto, setModalVideoAberto] = useState(false);
  const [exercicioSelecionado, setExercicioSelecionado] = useState("");
  const [tempo, setTempo] = useState(60); 
  const [cronometroRodando, setCronometroRodando] = useState(false);

  const [exerciciosConcluidos, setExerciciosConcluidos] = useState({});

  useEffect(() => {
    let intervalo = null;
    if (cronometroRodando && tempo > 0) {
      intervalo = setInterval(() => {
        setTempo((prev) => prev - 1);
      }, 1000);
  } else if (tempo === 0) {
  setCronometroRodando(false);
  setTimeout(() => {
    alert("Tempo de descanso concluído!");
    setTempo(60);
  }, 0);
}
    return () => clearInterval(intervalo);
  }, [cronometroRodando, tempo]);

  const abrirVideoExecucao = (nomeExercicio) => {
    setExercicioSelecionado(nomeExercicio);
    setTempo(60); 
    setCronometroRodando(false);
    setModalVideoAberto(true);
  };

  const alternarConcluido = (dia, index) => {
    const chave = `${dia}-${index}`;
    setExerciciosConcluidos((prev) => ({
      ...prev,
      [chave]: !prev[chave]
    }));
  };

  const formatarTempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const rotinaSemanal = {
    "Segunda-feira": {
      foco: "BRAÇOS e PEITO",
      tipo: "exercicios",
      exercicios: [
        { nome: "Flexão de braço", series: "3x", reps: "8 a 12 rep" },
        { nome: "Remada com garrafa ou mochila", series: "3x", reps: "10 a 12 rep" },
        { nome: "Rosca bíceps com garrafa ou elástico", series: "3x", reps: "10 a 12 rep" },
        { nome: "Tríceps banco (apoio em cadeira)", series: "3x", reps: "10 a 12 rep" }
      ]
    },
    "Terça-feira": {
      foco: "CARDIOVASCULAR",
      tipo: "corrida",
      descricao: "30 MIN DE CORRIDA NA RUA"
    },
    "Quarta-feira": {
      foco: "PERNAS E GLÚTEOS",
      tipo: "exercicios",
      exercicios: [
        { nome: "Agachamento livre", series: "3x", reps: "10 a 12 rep" },
        { nome: "Agachamento sumô", series: "3x", reps: "10 a 12 rep" },
        { nome: "Ponte de glúteo no chão", series: "3x", reps: "12 a 15 rep" },
        { nome: "Elevação de panturrilha em pé", series: "3x", reps: "12 a 15 rep." }
      ]
    },
    "Quinta-feira": {
      foco: "CARDIOVASCULAR",
      tipo: "corrida",
      descricao: "30 MIN DE CORRIDA NA RUA"
    },
    "Sexta-feira": {
      foco: "BRAÇOS e PEITO",
      tipo: "exercicios",
      exercicios: [
        { nome: "Flexão de braço", series: "3x", reps: "8 a 12 rep" },
        { nome: "Remada com garrafa ou mochila", series: "3x", reps: "10 a 12 rep" },
        { nome: "Rosca bíceps com garrafa ou elástico", series: "3x", reps: "10 a 12 rep" },
        { nome: "Tríceps banco (apoio em cadeira)", series: "3x", reps: "10 a 12 rep" }
      ]
    },
    "Sábado": {
      foco: "CARDIOVASCULAR",
      tipo: "corrida",
      descricao: "30 MIN DE CORRIDA NA RUA"
    }
  };

  const dadosDia = rotinaSemanal[diaAtivo];

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="brand-section">
          <h1 className="brand-name">Guidefit</h1>
        </div>

        <hr className="brand-divider" />

        <h2 className="dashboard-title">Olá, {nomeUsuario}.</h2>
        <p className="welcome-text">Acompanhe seu planejamento de atividades físicas.</p>

        {!temPlanoGerado ? (
          <div className="sem-treino-container">
            <p className="sem-treino-texto">
              Você ainda não possui um plano de treino. Clique aqui para criar o seu
            </p>
            <button className="btn-primary" onClick={() => setTemPlanoGerado(true)}>
              Gerar Plano de Treino
            </button>
          </div>
        ) : (
          <div className="com-treino-container">
            
            <div className="dias-abas-navegacao">
              {Object.keys(rotinaSemanal).map((dia) => (
                <button 
                  key={dia}
                  className={`aba-dia-btn ${dia === diaAtivo ? 'aba-ativa' : ''}`}
                  onClick={() => setDiaAtivo(dia)}
                >
                  {dia.split('-')[0].substring(0, 3)}
                </button>
              ))}
            </div>

            <div className="workout-section">
              <h3 className="workout-header">Planejamento — {diaAtivo}</h3>
              <p className="workout-focus">{dadosDia.foco}</p>
              
              <div className="exercises-container">
                {dadosDia.tipo === "exercicios" ? (
                  dadosDia.exercicios.map((ex, index) => {
                    const estaConcluido = exerciciosConcluidos[`${diaAtivo}-${index}`];
                    return (
                      <div key={index} className={`exercise-row ${estaConcluido ? 'row-concluida' : ''}`}>
                        <div className="exercise-main-info">
                          <span className="exercise-name">{ex.nome}</span>
                          <span className="exercise-sub">{ex.series} {ex.reps}</span>
                        </div>
                        <div className="exercise-actions-group">
                          <button className="btn-ver-execucao" onClick={() => abrirVideoExecucao(ex.nome)}>
                            Ver Execução
                          </button>
                          <button 
                            className={`btn-concluido-check ${estaConcluido ? 'checked' : ''}`}
                            onClick={() => alternarConcluido(diaAtivo, index)}
                          >
                            {estaConcluido ? "✓" : "Concluir"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="exercise-row">
                    <div className="exercise-main-info">
                      <span className="exercise-name" style={{ color: '#499388', fontWeight: '700' }}>
                        {dadosDia.descricao}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="btn-primary" onClick={() => alert('Treino iniciado.')}>
              Começar Treino
            </button>
          </div>
        )}

        <div className="shortcuts-links">
          <span className="link-item" onClick={() => window.location.href = '/progresso'}>Meu Progresso</span>
          <span className="link-item-space"></span>
          <span className="link-item" onClick={() => window.location.href = '/historico'}>Histórico</span>
        </div>
      </div>

      {modalVideoAberto && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-title">{exercicioSelecionado}</h3>
            <p className="modal-subtitle">Demonstração da execução correta do exercício.</p>
            
            <div className="video-player-placeholder">
              <span className="video-text-placeholder">O vídeo de execução será renderizado aqui</span>
            </div>

            <div className="cronometro-container">
              <p className="cronometro-label">⏱️ TEMPO DE DESCANSO</p>
              <div className="cronometro-display">{formatarTempo(tempo)}</div>
              <div className="cronometro-botoes">
                <button 
                  className="btn-cronometro-acao"
                  onClick={() => setCronometroRodando(!cronometroRodando)}
                >
                  {cronometroRodando ? "Pausar" : "Iniciar"}
                </button>
                <button 
                  className="btn-cronometro-reset"
                  onClick={() => { setCronometroRodando(false); setTempo(60); }}
                >
                  Resetar
                </button>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setModalVideoAberto(false)}>
              Fechar Janela
            </button>
          </div>
        </div>
      )}

      <footer className="custom-footer">
        <div className="footer-bar bar-top">SOBRE NÓS</div>
        <div className="footer-bar bar-middle">CULTURA</div>
        <div className="footer-bar bar-bottom">SAC</div>
      </footer>
    </div>
  );
}

export default Dashboard;
