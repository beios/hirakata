import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const mergeQuizResults = (localResults, serverResults) => {
    if (!localResults || !serverResults) return localResults || serverResults || [];
    
    const merged = [...localResults];
    serverResults.forEach(serverResult => {
        const existingIndex = merged.findIndex(local => 
            local.timestamp === serverResult.timestamp
        );
        
        if (existingIndex === -1) {
            merged.push(serverResult);
        }
    });
    
    return merged.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 100);
};

export const syncData = async (userId) => {
    if (!userId) return null;

    try {
        // 로컬 데이터 가져오기
        const practiceState = localStorage.getItem('practiceState');
        const quizResults = localStorage.getItem('quizResults');
        const localQuizResults = quizResults ? JSON.parse(quizResults) : [];

        // 서버 데이터 가져오기
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        const serverData = docSnap.exists() ? docSnap.data() : null;
        const serverQuizResults = serverData?.quizResults || [];

        // 데이터 병합
        const mergedQuizResults = mergeQuizResults(localQuizResults, serverQuizResults);

        // Firestore에 데이터 저장
        await setDoc(doc(db, 'users', userId), {
            practiceState: practiceState ? JSON.parse(practiceState) : null,
            quizResults: mergedQuizResults,
            lastSync: new Date().toISOString()
        });

        // 로컬 스토리지 업데이트
        localStorage.setItem('quizResults', JSON.stringify(mergedQuizResults));

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
            
            // 로컬 데이터 가져오기
            const localPracticeState = localStorage.getItem('practiceState');
            const localQuizResults = localStorage.getItem('quizResults');
            
            // 데이터 병합
            const mergedQuizResults = mergeQuizResults(
                localQuizResults ? JSON.parse(localQuizResults) : [],
                data.quizResults || []
            );
            
            // 로컬 스토리지에 데이터 저장
            if (data.practiceState) {
                localStorage.setItem('practiceState', JSON.stringify(data.practiceState));
            }
            localStorage.setItem('quizResults', JSON.stringify(mergedQuizResults));

            return true;
        }

        return false;
    } catch (error) {
        console.error('데이터 로드 에러:', error);
        return false;
    }
}; 