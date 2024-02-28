# Original gist from here: https://gist.github.com/ikey4u/659f38b4d7b3484d0b55de85a55a8154

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick is not installed or not in the PATH."
    exit 1
fi

# Check if Inkscape is installed
if [ "$(uname)" == "Darwin" ]; then
    if command -v inkscape &> /dev/null; then
        inkscape=inkscape
    else
        inkscape=/Applications/Inkscape.app/Contents/MacOS/inkscape
        if ! command -v $inkscape &> /dev/null; then
            echo "Error: Inkscape is not installed or not in the PATH."
            exit 1
        fi
    fi
else
    if ! command -v inkscape &> /dev/null; then
        echo "Error: Inkscape is not installed or not in the PATH."
        exit 1
    fi
fi

# Check if correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <input.svg> <output.icns>"
    exit 1
fi

insvg=$1
output=$2
img_sizes=(16 32 128 256 512)
outdir=${output}.iconset
convert_cmd="convert"

mkdir $outdir
for sz in "${img_sizes[@]}"
do
    echo "[+] Generete ${sz}x${sz} png..."
    $inkscape --export-filename=${outdir}/icon_${sz}x${sz}.png -w $sz -h $sz $insvg
    $inkscape --export-filename=${outdir}/icon_${sz}x${sz}@2x.png -w $((sz*2)) -h $((sz*2)) $insvg
    # Append to convert command
    convert_cmd+=" ${outdir}/icon_${sz}x${sz}.png"
done
convert_cmd+=" ${output}.ico"
eval $convert_cmd
echo "[+] The windows icon is saved to ${output}.ico"

# Copy largest PNG icon
largest_size=$(printf "%s\n" "${sizes[@]}" | sort -n | tail -1) # Find the largest size
cp ${outdir}/icon_${largest_size}x${largest_size}.png ${output}.png
echo "[+] Copying largest size png: ${largest_size}x${largest_size} to ${output}.png"

iconutil --convert icns --output ${output}.icns ${outdir}
echo "[+] The darwin icon is saved to ${output}.icns"
rm -rf ${outdir}

