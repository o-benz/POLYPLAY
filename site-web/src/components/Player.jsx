import React, { useContext, useState } from "react";
import { ACTIONS } from "../reducers/reducer";
import { formatTime } from "../assets/js/utils";
import { SHORTCUTS, SKIP_TIME } from "../assets/js/consts";
import PlaylistContext from "../contexts/PlaylistContext";
import { useEffect } from "react";

export default function Player() {

  const shortcuts = new Map();
  const { state, dispatch } = useContext(PlaylistContext);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [timeLine, setTimeLine] = useState(0);

  const playSong = () => {
    dispatch({ type: ACTIONS.PLAY, payload: { index: -1 } });
  };

  // TODO : ajouter une action de jouer la prochaine chanson
  const playNextSong = () => { dispatch({ type: ACTIONS.NEXT }); };

  // TODO : ajouter une action de jouer la chanson précédante
  const playPreviousSong = () => { dispatch({ type: ACTIONS.PREVIOUS }); };

  // TODO : ajouter une action de déplacement dans la barre de progrès
  const seek = (newTime) => { dispatch({ type: ACTIONS.SEEK, payload:{time: newTime}}); };

  // TODO : ajouter une action d'avancement/recul dans la chanson
  const scrubTime = (delta) => {dispatch({type: ACTIONS.SCRUB, payload: {delta: delta}}); };

  // TODO : ajouter une action de fermer/ouvrir le son
  const muteToggle = () => {dispatch({type: ACTIONS.MUTE}); };

  // TODO : ajouter une action d'activer ou désactiver le mode "shuffle"
  const shuffleToggle = () => {dispatch({type: ACTIONS.SHUFFLE}); };

  const shortcutHandler = (event) => {
    if (shortcuts.has(event.key)) {
      shortcuts.get(event.key)();
    }
  };

  const bindShortcuts = () => {

    shortcuts.set(SHORTCUTS.GO_FORWARD, () => scrubTime(SKIP_TIME));
    shortcuts.set(SHORTCUTS.GO_BACK, () => scrubTime(-SKIP_TIME));
    shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => playSong());
    shortcuts.set(SHORTCUTS.NEXT_SONG, () => playNextSong());
    shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => playPreviousSong());
    shortcuts.set(SHORTCUTS.MUTE, () => muteToggle());

    document.addEventListener("keydown", shortcutHandler);
  };

  useEffect(() => {
    state.audio.addEventListener("timeupdate", () => {
      const position = (100 * state.audio.currentTime) / state.audio.duration;
      setCurrentTime(formatTime(state.audio.currentTime));
      setTimeLine(!isNaN(state.audio.duration) ? position : 0);
    });

    state.audio.addEventListener("ended", () => {
      playNextSong();
    });

    bindShortcuts();

    return () => {
      document.removeEventListener("keydown", shortcutHandler);
      dispatch({ type: ACTIONS.STOP }); // On arrête le son lorsque le component n'est plus présent
    };
  }, []);
  return (
    <>
      <div id="now-playing">On joue : {state.currentSong}</div>
      <div id="controls" className="flex-column">
        <section id="buttons-container" className="flex-row">
          {/*TODO : géré l'événement 'click' */}
          <button
            className="control-btn fa fa-2x fa-arrow-left"
            id="previous"
            onClick={() => {playPreviousSong()}}
          ></button>
          <button
            className={`control-btn fa fa-2x ${state.audio.paused ? "fa-play" : "fa-pause"}`}
            id="play"
            onClick={() => { playSong() }}
          ></button>
          {/*TODO : géré l'événement 'click' */}
          <button
            className="control-btn fa fa-2x fa-arrow-right"
            id="next"
            onClick={() => {playNextSong()}}
          ></button>
          {/*TODO : géré l'événement 'click' */}
          <button
            className={`${state.shuffle ? "control-btn-toggled" : ""} control-btn fa fa-2x fa-shuffle`}
            id="shuffle"
            onClick={() => {shuffleToggle()}}
          ></button>
          {/*TODO : géré l'événement 'click' */}
          <button
            className={`control-btn fa fa-2x ${state.mute ? "fa-volume-mute" : "fa-volume-high"}`}
            id="mute"
            onClick={() => {muteToggle()}}
          ></button>
        </section>
        <section id="timeline-container" className="flex-row">
          {/*TODO : afficher le temps en cours de la chanson */}
          <span id="timeline-current">{state.audio.currentTime ? formatTime(state.audio.currentTime): "0:00"}</span>
          {/*TODO : afficher le progrès de la chanson */}
          <input
            id="timeline"
            type="range"
            max="100"
            value={timeLine ? (100* state.audio.currentTime)/state.audio.duration : 0}
            onInput={(e) => {
              seek(e.target.value);
            }}
          />
          <span id="timeline-end">{state.audio.duration ? formatTime(state.audio.duration) : "5:00"}</span>
        </section>
      </div>
    </>
  );
}
