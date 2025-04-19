'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import ContractorsService from '@/lib/services/contractors'

export function ContractorBulkImport() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check file extension
    const fileExt = selectedFile.name.split('.').pop()?.toLowerCase()
    if (fileExt !== 'xlsx' && fileExt !== 'csv') {
      setError('Please upload an Excel (.xlsx) or CSV file.')
      return
    }

    setFile(selectedFile)
    setError(null)
  }

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setFile(null)
    setProgress(0)
  }

  const handleImport = async () => {
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      // Show upload progress
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 5
        setProgress(Math.min(currentProgress, 95))
        if (currentProgress >= 95) clearInterval(interval)
      }, 100)

      // Use the ContractorsService to upload and import the file
      const result = await ContractorsService.importContractors(file)

      clearInterval(interval)
      setProgress(100)

      toast({
        title: 'Import successful',
        description: `${result.imported} contractors imported, ${result.skipped} skipped.`,
      })

      // Show errors if any
      if (result.errors && result.errors.length > 0) {
        console.error('Import errors:', result.errors)
        toast({
          title: 'Import completed with errors',
          description: `${result.errors.length} errors occurred during import.`,
          variant: 'destructive',
        })
      }

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/contractors')
      }, 1500)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'An error occurred during import. Please try again.'
      )
      console.error('Import error:', error)
      toast({
        title: 'Import failed',
        description:
          error instanceof Error
            ? error.message
            : 'There was an error importing contractors. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const downloadTemplate = () => {
    // CSV header
    const header =
      'FirstName,LastName,Email,Phone,Company,Street,City,State,ZipCode\n'

    // Example data rows
    const exampleRows = [
      'John,Smith,john.smith@example.com,555-123-4567,Smith Construction,123 Main St,New York,NY,10001',
      'Jane,Doe,jane.doe@example.com,555-987-6543,Doe Renovations,456 Oak Ave,Boston,MA,02108',
    ].join('\n')

    // Combine header and rows
    const csvContent = header + exampleRows

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    // Set attributes and trigger download
    link.setAttribute('href', url)
    link.setAttribute('download', 'contractor_import_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Template downloaded',
      description: 'The contractor import template has been downloaded.',
    })
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bulk Import Contractors</CardTitle>
          <CardDescription>
            Upload an Excel or CSV file to create multiple contractors at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!file ? (
            <div
              className="relative flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="mb-4 p-4 rounded-full bg-background border border-muted-foreground/25">
                <FileSpreadsheet className="h-8 w-8 text-primary" />
              </div>
              <p className="mb-2 text-lg font-semibold">
                Click to upload a file
              </p>
              <p className="text-sm text-muted-foreground">
                Upload an Excel (.xlsx) or CSV file with contractor data
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Maximum file size: 10MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center p-4 bg-muted rounded-lg">
                <div className="p-2 mr-4 bg-background rounded-md">
                  <FileSpreadsheet className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.size ? `${(file.size / 1024).toFixed(2)} KB` : ''}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFile()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {progress > 0 && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-right">
                    {progress === 100 ? 'Complete' : `${progress}% uploaded`}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            className="gap-2"
            onClick={downloadTemplate}
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push('/contractors')}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Import Contractors
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card className="mt-8 p-1">
        <CardContent>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="font-medium">Required Columns</h3>
              <p className="text-sm text-muted-foreground">
                The following columns are required in your Excel file:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>First Name</li>
                <li>Last Name</li>
                <li>Email</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Optional Columns</h3>
              <p className="text-sm text-muted-foreground">
                The following columns are optional:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Phone</li>
                <li>Company</li>
                <li>Street</li>
                <li>City</li>
                <li>State</li>
                <li>Zip Code</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Tips</h3>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Use the template for the correct column format</li>
                <li>Each contractor must have a unique email address</li>
                <li>For specialties, separate multiple values with commas</li>
                <li>Maximum 500 contractors per import</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
