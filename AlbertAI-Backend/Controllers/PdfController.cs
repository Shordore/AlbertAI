using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using UglyToad.PdfPig;
using System.Text;

namespace AlbertAI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PdfController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPdfs([FromForm] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files were uploaded.");
            }

            var combinedText = new StringBuilder();

            foreach (var file in files)
            {
                if (file.ContentType != "application/pdf")
                {
                    return BadRequest($"File {file.FileName} is not a PDF.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    
                    // Parse PDF into text
                    using (var pdfDocument = PdfDocument.Open(memoryStream.ToArray()))
                    {
                        foreach (var page in pdfDocument.GetPages())
                        {
                            combinedText.AppendLine(page.Text);
                        }
                        // Add a separator between PDFs
                        combinedText.AppendLine("\n--- End of PDF ---\n");
                    }
                }
            }

            // Return the combined text from all PDFs
            return Ok(new { 
                message = "PDFs processed successfully", 
                count = files.Count,
                text = combinedText.ToString()
            });
        }
    }
} 