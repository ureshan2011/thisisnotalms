import emailjs from '@emailjs/browser';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';
import type { Notice, StudentProfile } from './types';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string | undefined;

const APP_URL = 'https://ureshan2011.github.io/YooBees/#/student/notices';

const CATEGORY_LABELS: Record<Notice['category'], string> = {
  general:      'General',
  urgent:       'Urgent',
  auckland:     'Auckland Campus',
  christchurch: 'Christchurch Campus',
};

async function getStudentEmails(category: Notice['category']): Promise<string[]> {
  const ref = collection(db, 'students');
  const q =
    category === 'auckland'      ? query(ref, where('campus', '==', 'Auckland')) :
    category === 'christchurch'  ? query(ref, where('campus', '==', 'Christchurch')) :
    query(ref);

  const snap = await getDocs(q);
  return snap.docs
    .map(d => (d.data() as StudentProfile).email)
    .filter((e): e is string => typeof e === 'string' && e.includes('@'));
}

/**
 * Send a new-notice alert to all relevant students via EmailJS (BCC).
 * Returns the number of students emailed, or 0 if EmailJS is not configured.
 *
 * EmailJS template must have these variables:
 *   {{to_email}}        — staff/admin address (the visible "To")
 *   {{bcc_email}}       — comma-separated student emails
 *   {{notice_title}}
 *   {{notice_category}}
 *   {{notice_body}}
 *   {{author_name}}
 *   {{app_url}}
 */
export async function sendNoticeAlerts(
  notice: Pick<Notice, 'title' | 'body' | 'category'> & { authorName: string },
  staffEmail: string,
): Promise<number> {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return 0;

  const emails = await getStudentEmails(notice.category);
  if (emails.length === 0) return 0;

  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      to_email:         staffEmail,
      bcc_email:        emails.join(', '),
      notice_title:     notice.title,
      notice_category:  CATEGORY_LABELS[notice.category],
      notice_body:      notice.body,
      author_name:      notice.authorName,
      app_url:          APP_URL,
    },
    PUBLIC_KEY,
  );

  return emails.length;
}
