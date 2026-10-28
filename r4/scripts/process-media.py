"""Private review derivatives; originals are read-only inputs.
Usage: python scripts/process-media.py /path/to/04_MEDIA
Requires Pillow with AVIF/WebP and ffmpeg. Never upload review-media publicly.
"""
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from PIL import Image, ImageOps, ImageDraw

root=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]).resolve()
out=root/'review-media'
evidence=root/'evidence'
out.mkdir(exist_ok=True)
evidence.mkdir(exist_ok=True)
records=[]
originals=list((source/'photos_original').glob('*.jpg'))+[source/'video_original/20261015_210049.mp4']
hashes={str(p):hashlib.sha256(p.read_bytes()).hexdigest() for p in originals}

def save_image(im,destination,**options):
    with tempfile.NamedTemporaryFile(dir=out,suffix=destination.suffix,delete=False) as tmp:
        temp_path=Path(tmp.name)
    try:
        im.save(temp_path,**options)
        with Image.open(temp_path) as checked: checked.load()
        temp_path.replace(destination)
    finally:
        temp_path.unlink(missing_ok=True)

for p in sorted((source/'photos_original').glob('*.jpg')):
    im=ImageOps.exif_transpose(Image.open(p)).convert('RGB')
    large=im.copy();large.thumbnail((1280,1280),Image.Resampling.LANCZOS);large.info.clear()
    small=im.copy();small.thumbnail((640,640),Image.Resampling.LANCZOS);small.info.clear()
    save_image(large,out/(p.stem+'-1280.webp'),quality=84,method=6)
    save_image(large,out/(p.stem+'-1280.avif'),quality=55,speed=6)
    save_image(small,out/(p.stem+'-640.webp'),quality=80,method=6)
    records.append({'original':p.name,'sha256':hashes[str(p)],'originalBytes':p.stat().st_size,'originalPixels':list(im.size),
        'operations':['EXIF orientation','proportional resize','format encoding; metadata omitted'],
        'exposureAdjustment':0,'crop':None,'physicalChanges':False,
        'outputs':[{'file':x.name,'bytes':x.stat().st_size} for x in sorted(out.glob(p.stem+'-*'))]})
    after=Image.open(out/(p.stem+'-1280.webp'))
    canvas=Image.new('RGB',(1040,555),'#f5f1e9');draw=ImageDraw.Draw(canvas)
    for i,(image,label) in enumerate([(im,'ORIGINAL / '+p.name),(after,'WEBP / no exposure or geometry change')]):
        canvas.paste(ImageOps.contain(image,(500,500)),(i*520,40));draw.text((i*520+10,12),label,fill='#302b26')
    canvas.save(evidence/('compare-'+p.stem+'.jpg'),quality=85)

video=source/'video_original/20261015_210049.mp4'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','17.5','-i',str(video),'-t','3','-an',
    '-vf','scale=1080:1080:flags=lanczos','-c:v','libx264','-preset','slow','-crf','23','-pix_fmt','yuv420p','-r','30',
    '-movflags','+faststart',str(out/'room-film.mp4')],check=True)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','20','-i',str(video),'-frames:v','1',
    '-vf','scale=1280:1280:flags=lanczos',str(evidence/'film-poster.png')],check=True)
poster=Image.open(evidence/'film-poster.png').convert('RGB');poster.info.clear()
save_image(poster,out/'film-poster-1280.webp',quality=84,method=6)
save_image(poster,out/'film-poster-1280.avif',quality=55,speed=6)
save_image(poster.resize((640,640),Image.Resampling.LANCZOS),out/'film-poster-640.webp',quality=80,method=6)
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(out/'room-film.mp4'),
    '-vf','scale=160:160,tile=10x9','-frames:v','1',str(evidence/'film-all-90-frames.jpg')],check=True)
records.append({'original':video.name,'sha256':hashes[str(video)],'originalBytes':video.stat().st_size,
 'originalCodec':'HEVC','originalPixels':[1440,1440],
 'operations':['trim 17.500-20.500 seconds','remove audio','scale 1080x1080','H.264 yuv420p CRF23','faststart'],
 'output':'room-film.mp4','outputBytes':(out/'room-film.mp4').stat().st_size,
 'peopleRelease':'NEED VERIFY; visually screened person-free candidate only','roomMapping':'NEED VERIFY','publicationApproved':False})
for p in out.iterdir():
    if p.suffix in ['.webp','.avif']:
        with Image.open(p) as checked: checked.load()
        assert p.stat().st_size>0,str(p)
for p in originals:
    assert hashes[str(p)]==hashlib.sha256(p.read_bytes()).hexdigest(),'Original changed: '+str(p)
(evidence/'MEDIA_PROCESSING_LOG.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print('Private derivatives validated; original SHA-256 values unchanged.')
