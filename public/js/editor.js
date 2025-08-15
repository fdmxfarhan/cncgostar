tinymce.init({
  selector: 'textarea#edit',
  plugins: [
      // Core editing features
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
      // Your account includes a free trial of TinyMCE premium features
      // Try the most popular premium features until Aug 18, 2025:
      'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
  ],
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  tinycomments_mode: 'embedded',
  tinycomments_author: 'Author name',
  mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
  ],
  ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
  
  // RTL Configuration
  directionality: 'rtl',
  content_style: 'body { direction: rtl; text-align: right; }',
  
  // Image Upload Configuration
  images_upload_url: '/upload/blog-upload-image',
  images_upload_base_path: '/',
  images_upload_credentials: true,
  automatic_uploads: true,
  
  // Handle upload errors and success
  images_upload_handler: function (blobInfo, success, failure, progress) {
      return new Promise(function(resolve, reject) {
          var xhr, formData;
          xhr = new XMLHttpRequest();
          xhr.withCredentials = true;
          xhr.open('POST', '/upload/blog-upload-image');
          
          xhr.upload.onprogress = function (e) {
              if (progress && e.lengthComputable) {
                  progress(e.loaded / e.total * 100);
              }
          };
          
          xhr.onload = function() {
              var json;
              if (xhr.status !== 200) {
                  reject('HTTP Error: ' + xhr.status);
                  return;
              }
              
              try {
                  json = JSON.parse(xhr.responseText);
              } catch (e) {
                  reject('Invalid JSON response');
                  return;
              }
              
              // Handle both 'link' and 'location' response formats
              var imageUrl = json.link || json.location;
              if (!imageUrl) {
                  reject('No image URL in response');
                  return;
              }
              
              resolve(imageUrl);
          };
          
          xhr.onerror = function () {
              reject('Image upload failed due to a XHR transport error. Code: ' + xhr.status);
          };
          
          formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          xhr.send(formData);
      });
  }
});

