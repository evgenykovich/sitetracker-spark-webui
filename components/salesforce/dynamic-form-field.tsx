'use client'

import { useState, ChangeEvent, useRef } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { HelpCircle, Upload, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { SalesforceFormField } from '@/lib/services/salesforce'

interface DynamicFormFieldProps {
  field: SalesforceFormField & {
    description?: string
  }
  value?: string | boolean
  onChange?: (value: string | boolean) => void
  className?: string
  readOnly?: boolean
}

export function DynamicFormField({
  field,
  value,
  onChange,
  className,
  readOnly,
}: DynamicFormFieldProps) {
  const [internalValue, setInternalValue] = useState<string | boolean>(
    value || ''
  )
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (newValue: string | boolean) => {
    setInternalValue(newValue)
    onChange?.(newValue)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setPreview(null)
      handleChange('')
      return
    }

    // Update the value with the file name
    handleChange(file.name)

    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setPreview(null)
    handleChange('')
  }

  const renderHelpTooltip = () => {
    if (!field.Help_Text__c) return null

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="ml-2 h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{field.Help_Text__c}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const renderField = () => {
    switch (field.Type__c) {
      case 'Text':
        return (
          <Input
            type="text"
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )

      case 'Number':
        return (
          <Input
            type="number"
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )

      case 'Email':
        return (
          <Input
            type="email"
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )

      case 'Phone':
        return (
          <Input
            type="tel"
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )

      case 'Date':
        return (
          <Input
            type="date"
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )

      case 'Picklist':
        return (
          <Select
            value={internalValue as string}
            onValueChange={(value: string) => handleChange(value)}
            disabled={readOnly}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={field.Label__c} />
            </SelectTrigger>
            <SelectContent>
              {field.Picklist_Values__c?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'Checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={!!internalValue}
              onCheckedChange={(checked: boolean) => handleChange(checked)}
              id={field.Id}
              disabled={readOnly}
            />
            <Label htmlFor={field.Id}>{field.Label__c}</Label>
          </div>
        )

      case 'Image':
      case 'Photo':
      case 'File':
      case 'Photo/File':
        const isImage = field.Type__c === 'Image' || field.Type__c === 'Photo'
        return (
          <div className="space-y-4">
            <div
              className={`
                group relative rounded-xl border-2 border-dashed p-8
                ${readOnly ? 'bg-muted/50' : 'hover:bg-muted/50 cursor-pointer'}
                ${
                  internalValue
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-muted-foreground/25'
                }
                transition-all duration-200 ease-in-out
              `}
              onClick={() => !readOnly && fileInputRef.current?.click()}
            >
              <div
                className={`
                absolute inset-0 rounded-xl
                ${!readOnly && !internalValue && 'group-hover:bg-primary/5'}
                transition-colors duration-200
              `}
              />

              {!internalValue ? (
                <div className="relative flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="rounded-full bg-background border-2 border-primary/10 p-4 group-hover:border-primary/30 transition-colors duration-200">
                    <Upload className="h-8 w-8 text-primary/60 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {`Click to upload ${isImage ? 'an image' : 'a file'}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isImage ? 'SVG, PNG, JPG or GIF' : 'PDF, DOC, or TXT'}{' '}
                      (max. 10MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative space-y-6">
                  {preview && isImage ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-background/50 shadow-sm">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-black/10" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center aspect-video w-full rounded-lg bg-background/50 shadow-sm">
                      <div className="text-center space-y-3">
                        <div className="rounded-full bg-background border-2 border-primary/10 p-4 mx-auto">
                          <Upload className="h-8 w-8 text-primary/60" />
                        </div>
                        <p className="text-sm font-medium break-all px-4 max-w-[80%] mx-auto">
                          {internalValue as string}
                        </p>
                      </div>
                    </div>
                  )}
                  {!readOnly && (
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          clearFile()
                        }}
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          fileInputRef.current?.click()
                        }}
                        className="bg-background/80 backdrop-blur-sm"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Change
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={isImage ? 'image/*' : undefined}
                onChange={handleFileChange}
                required={field.Required__c}
                className="hidden"
                disabled={readOnly}
              />
            </div>

            <div className="px-1 flex justify-start items-center gap-2">
              {field.Required__c && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-destructive mr-2 animate-pulse" />
                  Required field
                </p>
              )}
              {field.Metadata?.requiredUploads > 0 && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  {field.Metadata.requiredUploads} upload
                  {field.Metadata.requiredUploads > 1 ? 's' : ''} required
                </p>
              )}
              {field.Metadata?.photoValidationChecklist && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 mr-2" />
                  Validation checklist required
                </p>
              )}
            </div>
          </div>
        )

      default:
        return (
          <Textarea
            placeholder={field.Label__c}
            value={(internalValue as string) || ''}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              handleChange(e.target.value)
            }
            required={field.Required__c}
            className={className}
            readOnly={readOnly}
          />
        )
    }
  }

  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        <div className="flex items-center">
          <Label htmlFor={field.Id} className="flex items-center">
            {field.Label__c}
            {field.Required__c && (
              <span className="text-destructive ml-1">*</span>
            )}
          </Label>
          {field.Help_Text__c && renderHelpTooltip()}
        </div>
      </div>
      {renderField()}
    </div>
  )
}
