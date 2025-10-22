import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLesson } from '../hooks/useLessons';
import LessonCompleteModal from './LessonCompleteModal';
import '../styles/lesson.css';

const LessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const lessonIdNumber = parseInt(lessonId || '1');
  const { lesson, loading, error } = useLesson(lessonIdNumber);

  const handleBackClick = () => {
    navigate('/routine');
  };


  const handleVideoClick = () => {
    setIsFullscreen(true);
    setIsPlaying(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleVideoPlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const video = videoRef.current;
    if (!video || !duration || duration === 0) {
      return;
    }
    
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeToggle = () => {
    setShowVolumeSlider(!showVolumeSlider);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (video.duration && !duration) {
        setDuration(video.duration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    if (video.readyState >= 1 && video.duration) {
      setDuration(video.duration);
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [duration]);

  useEffect(() => {
    if (isFullscreen && videoRef.current) {
      const video = videoRef.current;
      if (video.duration && video.duration !== duration) {
        setDuration(video.duration);
      }
    }
  }, [isFullscreen, duration]);

  const handleCompleteClick = () => {
    // Показываем модальное окно
    setShowCompleteModal(true);
  };

  const handleModalClose = () => {
    setShowCompleteModal(false);
    // В будущем здесь будет обновление статуса урока через бекенд
    navigate('/routine');
  };

  if (loading) {
    return (
      <div className="lesson-container">
        <div className="lesson-background">
          <div className="lesson-loading">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="lesson-container">
        <div className="lesson-background">
          <div className="lesson-error">Ошибка загрузки урока</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="lesson-background">
        
        {/* Top bar */}
        <div className="lesson-top-bar">
          <button className="lesson-back-button" onClick={handleBackClick}>
            <img src="/image/arrow_left.svg" alt="Back" className="lesson-back-arrow" />
          </button>
        </div>

        {/* Content */}
        <div className="lesson-content">
          <div className="lesson-content-wrapper">
            
            {/* Lesson details card */}
            <div className="lesson-details-card">
              
              {/* Header */}
              <div className="lesson-header">
                <div className="lesson-header-content">
                  <p className="lesson-category">{lesson.category}</p>
                  <div className="lesson-title-wrapper">
                    <h1 className="lesson-main-title">{lesson.title}</h1>
                  </div>
                </div>
                <div className="lesson-duration-badge">
                  <div className="lesson-duration-icon">
                    <img src="/image/Subtract.svg" alt="Duration" className="lesson-duration-img" />
                  </div>
                  <span className="lesson-duration-label">{lesson.duration}</span>
                </div>
              </div>

              {/* Video section */}
              <div className="lesson-video-container" onClick={handleVideoClick}>
                <video 
                  className="lesson-video"
                  poster={lesson.videoPreview}
                >
                  <source src={lesson.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                <button className="lesson-play-button" onClick={handleVideoClick}>
                  <div className="lesson-play-icon">
                    <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
                      <path d="M0 36V0L24 18L0 36Z" fill="white"/>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Description */}
              <div className="lesson-description">
                <p className="lesson-description-text">
                  {lesson.description}
                </p>
              </div>
            </div>

            {/* Tip/motivation card */}
            <div className="lesson-tip-card">
              <div className="lesson-tip-content">
                <p className="lesson-tip-label">{lesson.tipTitle}</p>
                <div className="lesson-tip-text-wrapper">
                  <p className="lesson-tip-text">
                    {lesson.tipText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Complete button */}
          <div className="lesson-button-wrapper">
            <button className="lesson-complete-button" onClick={handleCompleteClick}>
              Complete
            </button>
          </div>
        </div>
      </div>
      
      {/* Fullscreen video popup */}
      {isFullscreen && (
        <div className="fullscreen-video-overlay">
          <div className="fullscreen-video-container">
            <video 
              ref={videoRef}
              className="fullscreen-video"
              autoPlay
              preload="metadata"
              poster={lesson.videoPreview}
              onClick={handleVideoPlayPause}
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                setDuration(video.duration);
              }}
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                setCurrentTime(video.currentTime);
              }}
              onCanPlay={(e) => {
                const video = e.currentTarget;
                if (video.duration && duration === 0) {
                  setDuration(video.duration);
                }
              }}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Gradient overlay */}
            <div className="fullscreen-video-gradient"></div>
            
            {/* Interactive Timeline */}
            <div className="video-timeline-container" onClick={handleTimelineClick}>
              <div className="video-timeline-track">
                <div 
                  className="video-timeline-progress" 
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            {/* Play/Pause button - показывать только когда видео на паузе */}
            {!isPlaying && (
              <div className="fullscreen-play-button" onClick={handleVideoPlayPause}>
                <div className="fullscreen-play-icon">
                  <svg width="24" height="36" viewBox="0 0 24 36" fill="none">
                    <path d="M0 36V0L24 18L0 36Z" fill="white"/>
                  </svg>
                </div>
              </div>
            )}
            
            {/* Volume control */}
            <div className="fullscreen-volume-control">
              <button className="fullscreen-volume-button" onClick={handleVolumeToggle}>
                {volume === 0 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : volume < 0.5 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              
              {showVolumeSlider && (
                <div className="volume-slider-container">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
              )}
            </div>
            
            {/* Close button */}
            <button className="fullscreen-close-button" onClick={handleCloseFullscreen}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="#28194B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Lesson Complete Modal */}
      <LessonCompleteModal 
        isOpen={showCompleteModal}
        onClose={handleModalClose}
        lessonId={lessonIdNumber}
      />
    </div>
  );
};

export default LessonPage;
