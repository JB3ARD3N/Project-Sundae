import { supabase } from './config';
import JSZip from 'jszip';

export class SupabaseUploader {
  async uploadZip(file: File, projectName: string = 'project'): Promise<{
    url: string;
    files: string[];
    projectId: string;
  }> {
    const timestamp = Date.now();
    const projectId = `${projectName.replace(/\s+/g, '-')}-${timestamp}`;

    const { error: zipError } = await supabase.storage
      .from('projects')
      .upload(`${projectId}/original.zip`, file);

    if (zipError) throw new Error(`Upload failed: ${zipError.message}`);

    const { data: urlData } = supabase.storage
      .from('projects')
      .getPublicUrl(`${projectId}/original.zip`);

    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const fileList: string[] = [];

    for (const [filename, fileData] of Object.entries(contents.files)) {
      if (!fileData.dir) {
        const content = await fileData.async('blob');
        await supabase.storage
          .from('projects')
          .upload(`${projectId}/extracted/${filename}`, content);
        fileList.push(filename);
      }
    }

    await supabase.from('projects').insert({
      name: projectName,
      status: 'uploaded',
      files: fileList,
      zip_url: urlData.publicUrl
    });

    return { url: urlData.publicUrl, files: fileList, projectId };
  }
}

export const uploader = new SupabaseUploader();
