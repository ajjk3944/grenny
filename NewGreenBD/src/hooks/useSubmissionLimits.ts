import { useState, useEffect } from 'react';
import { useSubmissionStore } from '@/store/submissionStore';

export function useSubmissionLimits() {
  const { checkSubmissionLimits, dailySubmissionCount, lastSubmissionTime } = useSubmissionStore();
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [remainingSubmissions, setRemainingSubmissions] = useState(5);

  useEffect(() => {
    const updateLimits = () => {
      const limitCheck = checkSubmissionLimits();
      
      if (limitCheck.cooldownSeconds) {
        setCooldownSeconds(limitCheck.cooldownSeconds);
      } else {
        setCooldownSeconds(0);
      }

      setRemainingSubmissions(5 - dailySubmissionCount);
    };

    updateLimits();

    // Update every second if in cooldown
    const interval = setInterval(() => {
      updateLimits();
    }, 1000);

    return () => clearInterval(interval);
  }, [dailySubmissionCount, lastSubmissionTime]);

  const formatCooldown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const limitCheck = checkSubmissionLimits();

  return {
    canSubmit: limitCheck.canSubmit,
    cooldownSeconds,
    cooldownFormatted: formatCooldown(cooldownSeconds),
    remainingSubmissions,
    message: limitCheck.message,
  };
}
