'use client'
import { Button, Callout, TextField, TextFieldInput , Text } from '@radix-ui/themes'
import React, { useState } from 'react'
import SimpleMDE from "react-simplemde-editor";
import {useForm , Controller} from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';
import {zodResolver} from '@hookform/resolvers/zod'  //this package lib make react-hook-form to integrate various form validation lib like zod
import { createIssueSchema } from '@/app/validationSchemas';
import {z} from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

// interface IssueForm {
//   title:string;
//   description: string;
// }

type IssueForm = z.infer<typeof createIssueSchema>; // this'll return the type obj so we that

const  NewIssuePage = () => {
  const router = useRouter();
  const {register , control , handleSubmit,formState:{errors}} = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema)
  });
  const [error,setError] = useState('');
  const [isSubmitting,setSubmitting] = useState(false);
  const onSubmit =handleSubmit(async(data)=>{
    try{
      setSubmitting(true);
      await axios.post('/api/issues',data);
      router.push('/issues');
    } catch (error){
      // console.log(error)
      setSubmitting(false);
      setError('An unexpected error occurred.');
    }
  })
  console.log(register('title'));
  return (
    <div className='max-w-xl'>
      {error && <Callout.Root color='red' className='mb-5'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>}
      <form 
        className='space-y-3' 
        onSubmit={onSubmit}>
        <TextField.Root>
            <TextField.Input placeholder='Title' {...register('title')}/>
        </TextField.Root>
         <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller 
          name='description'
          control={control}
          render={({field})=><SimpleMDE placeholder='Description' {...field}/> /*we can't use register by using spread operator way ,so we use contoller */}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>Submit New Issue {isSubmitting && <Spinner/>}</Button>
      </form>
    </div>
  )
}

export default  NewIssuePage