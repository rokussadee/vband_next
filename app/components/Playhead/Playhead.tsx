interface PlayheadProps {
  position: number;
  isPlaying: boolean;
}

const Playhead: React.FC<PlayheadProps> = ({ position, isPlaying }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${position * 100}%`,
        top: 0,
        bottom: 0,
        width: '2px',
        backgroundColor: isPlaying ? 'red' : 'gray',
        transition: 'left 0.1s linear',
      }}
    />
  );
};

export default Playhead;
