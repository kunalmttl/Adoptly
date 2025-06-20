

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MinimalLayout from './components/layout/MinimalLayout';
import HomePage from './pages/HomePage';


function App() 
{
    return (
        <Router>
            <Routes>
                <Route element={<MinimalLayout />}>
                    <Route path="/" element={<HomePage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;