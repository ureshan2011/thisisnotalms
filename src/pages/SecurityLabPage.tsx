import { useEffect } from 'react';

export default function SecurityLabPage() {
  useEffect(() => {
    window.location.href = import.meta.env.BASE_URL + 'security-lab.html';
  }, []);
  return null;
}
