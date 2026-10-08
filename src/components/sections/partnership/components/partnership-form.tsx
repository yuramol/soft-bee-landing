'use client';

import { useEffect, useRef, useState, type BaseSyntheticEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { executeRecaptcha } from '@/lib/estimator/recaptcha-client';
import { CONTACT_RECAPTCHA_ACTIONS } from '@/lib/contact/constants';
import { submitContactForm } from '@/lib/api/contact';
import content from '../partnership.json';

const { form: f } = content;

const partnershipSchema = z.object({
  name: z.string().min(1, f.validation.nameRequired),
  email: z.email(f.validation.emailInvalid),
  company: z.string().min(1, f.validation.companyRequired),
  website: z
    .string()
    .refine((val) => !val || /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val), f.validation.websiteInvalid)
    .optional(),
  partnershipType: z.string().min(1, f.validation.partnershipTypeRequired),
  message: z.string().optional()
});

type PartnershipFormValues = z.infer<typeof partnershipSchema>;

export default function PartnershipForm() {
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PartnershipFormValues>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      website: '',
      partnershipType: '',
      message: ''
    }
  });

  useEffect(() => {
    if (isComplete) successHeadingRef.current?.focus();
  }, [isComplete]);

  async function onSubmit(data: PartnershipFormValues) {
    setSubmitError(null);

    const messageContent = [
      `Company: ${data.company}`,
      data.website ? `Website: ${data.website}` : null,
      `Partnership Type: ${data.partnershipType}`,
      data.message ? `\nMessage:\n${data.message}` : null
    ]
      .filter(Boolean)
      .join('\n');

    try {
      const captchaToken = await executeRecaptcha(CONTACT_RECAPTCHA_ACTIONS.partnership);

      await submitContactForm({
        kind: 'partnership',
        fullName: data.name,
        email: data.email,
        message: messageContent,
        captchaToken
      });

      setIsComplete(true);
    } catch (error) {
      console.error('Failed to submit partnership form:', error);
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
    }
  }

  function handleFormSubmit(e: BaseSyntheticEvent) {
    void handleSubmit(onSubmit)(e);
  }

  function startAgain() {
    setIsComplete(false);
    reset();
    requestAnimationFrame(() => {
      document.getElementById('partner-name')?.focus();
    });
  }

  function errorFor(name: keyof PartnershipFormValues) {
    return errors[name] ? (
      <Typography variant='caption2' className='pf-error' id={`partner-${name}-error`} tag='p'>
        {errors[name]?.message}
      </Typography>
    ) : null;
  }

  function accessibilityFor(name: keyof PartnershipFormValues) {
    return {
      'aria-invalid': errors[name] ? true : undefined,
      'aria-describedby': errors[name] ? `partner-${name}-error` : undefined
    };
  }

  return (
    <div className='pf-card'>
      <form
        id='partnership-form'
        className='pf-form'
        onSubmit={handleFormSubmit}
        noValidate
        aria-labelledby={isComplete ? 'partnership-success-title' : 'partnership-form-title'}
      >
        {isComplete ? (
          <div className='pf-success'>
            <span className='pf-successMark' aria-hidden='true'>
              ✓
            </span>
            <div id='partnership-success-title' ref={successHeadingRef} tabIndex={-1} className='outline-none'>
              <Typography variant='h3'>{f.success.title}</Typography>
            </div>
            <Typography variant='body2' className='pf-successMessage' tag='p'>
              {f.success.message}
            </Typography>

            <Button variant='primary' type='button' onClick={startAgain}>
              {f.success.buttonText}
            </Button>
          </div>
        ) : (
          <>
            <div className='pf-intro'>
              <Typography variant='h3' id='partnership-form-title'>
                {f.intro.title}
              </Typography>
              <Typography variant='body3' tag='p'>
                {f.intro.requiredTextPrefix}{' '}
                <Typography variant='body3' tag='span' aria-hidden='true'>
                  *
                </Typography>
                <Typography variant='body3' tag='span' className='pf-srOnly'>
                  {f.intro.requiredTextAsteriskLabel}
                </Typography>{' '}
                {f.intro.requiredTextSuffix}
              </Typography>
            </div>

            <div className='pf-fields'>
              <div className='pf-field'>
                <label htmlFor='partner-name'>
                  {f.fields.name.label} <span aria-hidden='true'>*</span>
                </label>
                <Input
                  id='partner-name'
                  type='text'
                  autoComplete='name'
                  placeholder={f.fields.name.placeholder}
                  disabled={isSubmitting}
                  {...register('name')}
                  {...accessibilityFor('name')}
                />
                {errorFor('name')}
              </div>
              <div className='pf-field'>
                <label htmlFor='partner-email'>
                  {f.fields.email.label} <span aria-hidden='true'>*</span>
                </label>
                <Input
                  id='partner-email'
                  type='email'
                  autoComplete='email'
                  placeholder={f.fields.email.placeholder}
                  disabled={isSubmitting}
                  {...register('email')}
                  {...accessibilityFor('email')}
                />
                {errorFor('email')}
              </div>
              <div className='pf-field'>
                <label htmlFor='partner-company'>
                  {f.fields.company.label} <span aria-hidden='true'>*</span>
                </label>
                <Input
                  id='partner-company'
                  type='text'
                  autoComplete='organization'
                  placeholder={f.fields.company.placeholder}
                  disabled={isSubmitting}
                  {...register('company')}
                  {...accessibilityFor('company')}
                />
                {errorFor('company')}
              </div>
              <div className='pf-field'>
                <label htmlFor='partner-website'>
                  {f.fields.website.label}{' '}
                  <Typography variant='caption3' tag='span' className='pf-optional'>
                    {f.fields.website.optionalText}
                  </Typography>
                </label>
                <Input
                  id='partner-website'
                  type='url'
                  autoComplete='url'
                  placeholder={f.fields.website.placeholder}
                  disabled={isSubmitting}
                  {...register('website')}
                  {...accessibilityFor('website')}
                />
                {errorFor('website')}
              </div>
              <div className='pf-field pf-fullWidth'>
                <label htmlFor='partner-type'>
                  {f.fields.partnershipType.label} <span aria-hidden='true'>*</span>
                </label>
                <Controller
                  control={control}
                  name='partnershipType'
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                      <SelectTrigger id='partner-type' {...accessibilityFor('partnershipType')}>
                        <SelectValue placeholder={f.fields.partnershipType.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {f.fields.partnershipType.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errorFor('partnershipType')}
              </div>
              <div className='pf-field pf-fullWidth'>
                <label htmlFor='partner-message'>
                  {f.fields.message.label}{' '}
                  <Typography variant='caption3' tag='span' className='pf-optional'>
                    {f.fields.message.optionalText}
                  </Typography>
                </label>
                <Textarea
                  id='partner-message'
                  rows={3}
                  placeholder={f.fields.message.placeholder}
                  disabled={isSubmitting}
                  {...register('message')}
                  {...accessibilityFor('message')}
                />
                {errorFor('message')}
              </div>
            </div>

            {Object.keys(errors).length > 0 && (
              <Typography variant='caption2' className='pf-errorSummary' role='alert' tag='p'>
                {f.footer.errorSummary}
              </Typography>
            )}

            {submitError && (
              <Typography variant='caption2' className='pf-errorSummary' role='alert' tag='p'>
                {submitError} Please try again.
              </Typography>
            )}

            <div className='pf-actions'>
              <Button variant='primary' type='submit' className='w-full' disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : f.footer.submitButton}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
