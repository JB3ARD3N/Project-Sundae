import { supabase } from './config';
import JSZip from 'jszip';

export class SupabaseUploader {
  async uploadZip(file: File, projectName: string): Promise<{
    url: string;
    files: string[];
    projectId: string;
  }> {
    const timestamp = Date.now();
    const projectId = `${projectName.replace(/\s+/g, '-')}-${timestamp}`;

    const { data: zipData, error: zipError } = await supabase.storage
      .from('projects')
      .upload(`${projectId}/original.zip`, file);

    if (zipError) throw new Error(`Zip upload failed: ${zipError.message}`);

    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(`${projectId}/original.zip`);

    const zipUrl = urlData.publicUrl;

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const fileList: string[] = [];

    for (const [filename, fileData] of Object.entries(contents.files)) {
      if (!fileData.dir) {
        const content = await fileData.async('blob');

        const { error: fileError } = await supabase.storage
          .from('projects')
          .upload(`${projectId}/extracted/${filename}`, content);

        if (!fileError) {
          fileList.push(filename);
        }
      }
    }

    const { error: dbError } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        status: 'uploaded',
        files: fileList,
        zip_url: zipUrl
      });

    if (dbError) console.error('Database insert failed:', dbError);

    return { url: zipUrl, files: fileList, projectId };
  }
}

export const uploader = new SupabaseUploader();
