'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>

export function AuthForm() {
  const [isLoading, setIsLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('login')
  const { login, register } = useAuth()
  const { toast } = useToast()

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
  })

  async function onLogin(data: LoginFormValues) {
    try {
      setIsLoading(true)
      await login(data.email, data.password)
      toast({
        title: 'Success',
        description: 'Login successful!',
        duration: 2000,
      })
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to login',
        variant: 'destructive',
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onRegister(data: RegisterFormValues) {
    try {
      setIsLoading(true)
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      toast({
        title: 'Success',
        description: 'Registration successful!',
      })
    } catch (error) {
      console.error('Register error:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to register',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or create a new account</CardDescription>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
              transition={{
                duration: 0.15,
                ease: 'easeInOut',
              }}
            >
              <TabsContent value="login" forceMount>
                <motion.div
                  initial={false}
                  animate={activeTab === 'login' ? 'show' : 'hide'}
                  variants={{
                    show: {
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: 'easeOut' },
                      },
                    },
                    hide: {
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: 'easeIn' },
                      },
                    },
                  }}
                  style={{ overflow: 'hidden' }}
                  className="px-3 py-[1px]"
                >
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLogin)}
                      className="space-y-4"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Login'}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              </TabsContent>

              <TabsContent value="register" forceMount>
                <motion.div
                  initial={false}
                  animate={activeTab === 'register' ? 'show' : 'hide'}
                  variants={{
                    show: {
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.3, ease: 'easeOut' },
                      },
                    },
                    hide: {
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.3, ease: 'easeIn' },
                      },
                    },
                  }}
                  style={{ overflow: 'hidden' }}
                  className="px-3 py-[1px]"
                >
                  <Form {...registerForm}>
                    <form
                      onSubmit={registerForm.handleSubmit(onRegister)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Loading...' : 'Register'}
                      </Button>
                    </form>
                  </Form>
                </motion.div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Tabs>
    </Card>
  )
}
