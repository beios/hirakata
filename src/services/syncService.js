import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const syncData = async (userId) => {
    if (!userId) return null;

    try {
        // 로컬 데이터 가져오기
        const practiceState = localStorage.getItem('practiceState');
        const quizResults = localStorage.getItem('quizResults');

        // Firestore에 데이터 저장
        await setDoc(doc(db, 'users', userId), {
            practiceState: practiceState ? JSON.parse(practiceState) : null,
            quizResults: quizResults ? JSON.parse(quizResults) : [],
            lastSync: new Date().toISOString()
        });

        return true;
    } catch (error) {
        console.error('동기화 에러:', error);
        return false;
    }
};

export const loadSyncedData = async (userId) => {
    if (!userId) return null;

    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 로컬 스토리지에 데이터 저장
            if (data.practiceState) {
                localStorage.setItem('practiceState', JSON.stringify(data.practiceState));
            }
            if (data.quizResults) {
                localStorage.setItem('quizResults', JSON.stringify(data.quizResults));
            }

            return true;
        }

        return false;
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return false;
    }
}; 