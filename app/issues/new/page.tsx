'use client'
import { Button, Callout, TextField, TextFieldInput } from '@radix-ui/themes'
import React, { useState } from 'react'
import SimpleMDE from "react-simplemde-editor";
import {useForm , Controller} from 'react-hook-form';
import axios from 'axios';
import "easymde/dist/easymde.min.css";
import { useRouter } from 'next/navigation';

interface IssueForm {
  title:string;
  description: string;
}

const  NewIssuePage = () => {
  const router = useRouter();
  const {register , control , handleSubmit} = useForm<IssueForm>();
  const [error,setError] = useState('');
  console.log(register('title'));
  return (
    <div className='max-w-xl'>
      {error && <Callout.Root color='red' className='mb-5'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>}
      <form 
        className='space-y-3' 
        onSubmit={handleSubmit(async(data)=>{
          try{
            await axios.post('/api/issues',data);
            router.push('/issues');
          } catch (error){
            // console.log(error)
            setError('An unexpected error occurred.');
          }
        })}>
        <TextField.Root>
            <TextField.Input placeholder='Title' {...register('title')}/>
        </TextField.Root>
        <Controller 
          name='description'
          control={control}
          render={({field})=><SimpleMDE placeholder='Description' {...field}/> /*we can't use register by using spread operator way ,so we use contoller */}
        />
        
        <Button>Submit New Issue</Button>
      </form>
    </div>
  )
}

export default  NewIssuePage