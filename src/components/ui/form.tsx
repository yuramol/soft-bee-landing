import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Label } from '@ui/label';
import { Typography } from '@ui/typography';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormWrapperRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div {...props} ref={ref} className={cn('flex w-full flex-1 flex-col gap-4 md:flex-row', className)} />;
});
FormWrapperRow.displayName = 'FormWrapperRow';

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('mb-4 space-y-1', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

type FormLabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
  variant?: 'primary' | 'secondary';
  required?: boolean;
};

export const formLabelVariants = cva('!text-body3 !font-normal !text-gray');

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ className, variant, required, children, ...props }, ref) => {
    const { formItemId } = useFormField();

    return (
      <Label ref={ref} htmlFor={formItemId} variant={variant} className={cn(formLabelVariants(), className)} {...props}>
        {children}
        {required && '*'}
      </Label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <Typography id={formDescriptionId} className={cn('text-blue', className)} variant='body2' {...props} />;
  }
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <Typography
        variant='caption'
        id={formMessageId}
        className={cn('text-destructive block text-xs !leading-none font-semibold text-wrap', className)}
        {...props}
      >
        {body}
      </Typography>
    );
  }
);
FormMessage.displayName = 'FormMessage';

const FormWrapperBlock = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'border-blue-light flex flex-1 flex-col justify-between rounded-md border p-2.5 whitespace-nowrap contain-inline-size',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FormWrapperBlock.displayName = 'FormWrapperBlock';

export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormWrapperBlock, FormWrapperRow, useFormField };
