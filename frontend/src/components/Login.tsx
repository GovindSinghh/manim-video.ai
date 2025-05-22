import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login=()=>{
    interface LoginFormData {
        email: string;
        password: string;
    }

    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3000/api/login', formData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                navigate('/');
            }
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return(
            <div className="grid grid-cols-3">
                <div className="grid col-span-2 h-screen flex justify-center items-center bg-gradient-to-r from-gray-400 to-gray-600 relative">
                    <span className="absolute top-10 left-10 text-2xl font-sans text-zinc-200 font-bold">MathVizAI</span>
                    <pre className="text-center font-medium text-2xl text-yellow-200 font-serif">
                        
                        <span className="text-zinc-300">
                            Transform Complex Math into Visual Masterpieces
                            <br />
                            Experience the power of AI-driven mathematical animations
                            <br /><br/>
                            - Crafted by Govind
                        </span>
                        
                    </pre>
                </div>
                <div className="grid col-span-1 h-screen flex justify-center items-center">
                    <div className="max-w-md space-y-8 h-fit w-fit p-9 border rounded-t-xl shadow-xl">
                        <div>
                            <h2 className="mt-6 text-center text-3xl font-bold px-4 text-zinc-700">
                                LOGIN
                            </h2>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="sr-only">Email address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none rounded-none relative block w-full mx-3  px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="appearance-none rounded-none relative block w-full mx-3 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {loading ? 'Logging in...' : 'Log In'}
                                </button>
                            </div>
                            <span className="mt-4 text-amber-500 text-sm text-sans text-right">Don't have an account ? <Link to="/signup" className="font-medium underline">SignUp</Link></span>
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default Login;