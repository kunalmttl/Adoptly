import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

// animation for form elements

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


// form validation schema

const formSchema = z.object({
        name: z.string().optional(),
        email: z.string().email({message: 'Invalid email address'}),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// props for reusable form elements

interface AuthFormProps {
        formtype: 'login' | 'register';
        onSubmit: (values: z.infer<typeof formSchema>) => void;
};



const AuthForm = ({formtype, onSubmit} : AuthFormProps) => {

        const form = useForm<z.infer<typeof formSchema>>(
        {
                resolver: zodResolver(formSchema),
                defaultValues: {
                        name: '',
                        email: '',
                        password: '',
                },
        })

        // define what text will show based on form type
        
        const title = (formtype === 'register') ? "Create an account" : "Welcome back";
        const description = (formtype === 'register') ? "Enter your details below to create your account." : "Enter your email and password to sign in.";
        const buttonText = (formtype === 'register') ? "Create Account" : "Sign In";
        const footerText = (formtype === 'register') ? "Already have an account?" : "Don't have an account?";
        const footerLink = (formtype === 'register') ? "/login" : "/register";
        const footerLinkText = (formtype === 'register') ? "Sign In" : "Sign Up";


        return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <Card className="w-full max-w-sm">
                        <CardHeader className="text-center">
                                <CardTitle> {title}</CardTitle>
                                <CardDescription> {description} </CardDescription>
                        </CardHeader>

                        <CardContent>
                                <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                                {formtype === 'register' && (
                                                        <motion.div
                                                                initial="hidden"
                                                                animate="visible"
                                                                variants={formVariants}
                                                                transition={{ delay: 0.1 }}>
                                                                <FormField
                                                                        control={form.control}
                                                                        name="name"
                                                                        render={({ field }) => (
                                                                                <FormItem>
                                                                                        <FormLabel>Name</FormLabel>
                                                                                        <FormControl>
                                                                                                <Input {...field} placeholder="Enter your name" />
                                                                                        </FormControl>
                                                                                        <FormMessage />
                                                                                </FormItem>
                                                                        )}/>
                                                        </motion.div>
                                                )}
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
                                                        <FormField
                                                                control={form.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                <FormItem>
                                                                <FormLabel>Email</FormLabel>
                                                                <FormControl>
                                                                        <Input type="email" placeholder="you@example.com" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                                </FormItem>
                                                                )}/>
                                                </motion.div>
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
                                                        <FormField
                                                        control={form.control}
                                                        name="password"
                                                        render={({ field }) => (
                                                        <FormItem>
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                                <Input type="password" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                        </FormItem>)}/>
                                                </motion.div>
                                                <motion.div variants={formVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
                                                        <Button type="submit" className="w-full">{buttonText}</Button>
                                                </motion.div>
                                        </form>
                                </Form>
                        </CardContent>
                        <CardFooter className="flex justify-center text-sm"> 
                                <p>{footerText} <Link to={footerLink} className="font-semibold text-indigo-600 hover:underline">{footerLinkText}</Link></p> 
                        </CardFooter>
                </Card>
        </motion.div>
        )
}

export default AuthForm
